const { chromium } = require("@playwright/test");
const assert = require("node:assert/strict");
const server = require("node:child_process").spawn(
  "node",
  ["node_modules/vite/bin/vite.js", "--host", "127.0.0.1"],
  { cwd: process.cwd(), stdio: "ignore" },
);
process.on("exit", () => server.kill());
(async () => {
  require("node:fs").mkdirSync("test-results", { recursive: true });
  await new Promise((r) => setTimeout(r, 1200));
  const browser = await chromium.launch({
    executablePath:
      process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || undefined,
    headless: true,
    args: ["--no-sandbox", "--disable-dev-shm-usage"],
  });
  const page = await browser.newPage({
    viewport: { width: 1440, height: 1000 },
  });
  const errors = [];
  await page.route("https://fonts.googleapis.com/**", (r) => r.abort());
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("http://127.0.0.1:5173", { waitUntil: "domcontentloaded" });
  await page.locator(".project-folder").first().waitFor();
  await page.screenshot({ path: "test-results/desktop.png", fullPage: true });
  assert.equal(await page.locator(".project-folder").count(), 2);
  await page.getByRole("link", { name: "Explore our work" }).click();
  await page.locator(".project-folder").first().click();
  await page.locator(".campaign-summary").waitFor();
  await page.getByRole("button", { name: /Expand artwork/ }).click();
  assert.equal(await page.locator("dialog").evaluate((d) => d.open), true);
  await page.keyboard.press("Escape");
  assert.equal(await page.locator("dialog").evaluate((d) => d.open), false);
  await page.reload();
  await page.locator(".campaign-summary").waitFor();
  await page.screenshot({ path: "test-results/client.png", fullPage: true });
  await page.goto("http://127.0.0.1:5173/work");
  await page.locator(".project-folder").first().waitFor();
  await page
    .getByRole("button", { name: "Social Media Advertising", exact: true })
    .click();
  assert.equal(await page.locator(".project-folder").count(), 1);
  await page
    .getByRole("button", { name: "All projects", exact: false })
    .click();
  assert.ok(
    await page
      .locator(".project-grid")
      .evaluate((e) => e.classList.contains("list-view")),
  );
  await page.getByRole("button", { name: "All work", exact: true }).click();
  assert.equal(await page.locator(".project-folder").count(), 2);
  for (const width of [390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const route of [
      "/",
      "/work",
      "/work/cmp-1",
      "/services",
      "/about",
      "/contact",
    ]) {
      await page.goto("http://127.0.0.1:5173" + route);
      await page.waitForTimeout(250);
      assert.ok(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= window.innerWidth,
        ),
        `overflow ${route} ${width}`,
      );
    }
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("http://127.0.0.1:5173", { waitUntil: "domcontentloaded" });
  await page.locator(".project-folder").first().waitFor();
  await page.screenshot({ path: "test-results/mobile.png", fullPage: true });
  await page.getByRole("button", { name: "Menu +" }).click();
  await page
    .locator(".mobile-nav")
    .getByRole("link", { name: "The work" })
    .click();
  assert.equal(await page.locator(".mobile-nav").count(), 0);
  await page.getByRole("button", { name: /Switch to light/ }).click();
  assert.equal(
    await page.locator("html").evaluate((e) => e.classList.contains("dark")),
    false,
  );
  await page.screenshot({ path: "test-results/light.png", fullPage: true });
  await page.emulateMedia({ reducedMotion: "reduce" });
  assert.equal(
    await page
      .locator(".folder-stage")
      .first()
      .evaluate((e) => getComputedStyle(e).transitionDuration),
    "0s",
  );
  assert.deepEqual(errors, []);
  console.log(
    "PASS: folders, deep links, dialog/Escape, filters, views, 18 responsive route checks, mobile menu, light theme, reduced motion; no runtime errors",
  );
  await browser.close();
  server.kill();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});

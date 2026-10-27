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
  await page.getByRole("button", { name: "Pause motion" }).click();
  assert.equal(
    await page
      .locator(".star-system")
      .evaluate((e) => e.classList.contains("motion-paused")),
    true,
  );
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
  assert.ok(await page.locator(".mission-index").isVisible());
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
    .getByRole("link", { name: "The universe" })
    .click();
  assert.equal(await page.locator(".mobile-nav").count(), 0);
  await page.getByRole("button", { name: /Switch to light/ }).click();
  assert.equal(
    await page.locator("html").evaluate((e) => e.classList.contains("dark")),
    false,
  );
  await page.screenshot({ path: "test-results/light.png", fullPage: true });
  await page.getByRole("button", { name: "Explore", exact: false }).click();
  await page.locator(".client-planet").first().waitFor();
  await page.emulateMedia({ reducedMotion: "reduce" });
  assert.equal(
    await page
      .locator(".client-planet")
      .first()
      .evaluate((e) => getComputedStyle(e).animationName),
    "none",
  );
  // Exercise a collection larger than one orbital sector.
  await page.evaluate(() => {
    const db = JSON.parse(localStorage.getItem("adliens-admin-db-v1"));
    for (let i = 0; i < 5; i++)
      db.caseStudies.push({
        ...db.caseStudies[0],
        id: `test-${i}`,
        companyId: `test-company-${i}`,
        companyName: `Test world ${i}`,
      });
    localStorage.setItem("adliens-admin-db-v1", JSON.stringify(db));
  });
  await page.goto("http://127.0.0.1:5173/work");
  await page.locator(".client-planet").first().waitFor();
  assert.equal(await page.locator(".client-planet").count(), 4);
  await page.getByRole("button", { name: "Next sector" }).click();
  assert.equal(await page.locator(".client-planet").count(), 3);
  await page.getByRole("button", { name: "Previous sector" }).click();
  assert.equal(await page.locator(".client-planet").count(), 4);
  await page.screenshot({
    path: "test-results/mobile-dense.png",
    fullPage: true,
  });
  await page.evaluate(() =>
    localStorage.setItem("adliens-admin-db-v1", "{broken"),
  );
  await page.reload();
  await page.getByRole("button", { name: "Reconnect" }).waitFor();
  await page.evaluate(() => localStorage.removeItem("adliens-admin-db-v1"));
  await page.getByRole("button", { name: "Reconnect" }).click();
  await page.locator(".client-planet").first().waitFor();
  assert.equal(await page.locator(".client-planet").count(), 2);
  assert.deepEqual(errors, []);
  console.log(
    "PASS: planets, motion pause, deep links, dialog/Escape, filters, views, 18 responsive route checks, mobile menu, light theme, reduced motion, multi-sector collections, error recovery; no runtime errors",
  );
  await browser.close();
  server.kill();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});

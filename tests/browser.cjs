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
  await page.goto("http://127.0.0.1:5173/", { waitUntil: "domcontentloaded" });
  assert.ok(
    await page.getByRole("link", { name: "Enter our universe" }).isVisible(),
  );
  assert.equal(await page.locator(".cinema-film").count(), 0);
  assert.equal(
    await page.locator(".site-header,.site-footer,.star-system").count(),
    0,
  );
  assert.ok(
    await page.evaluate(
      () => document.documentElement.scrollHeight <= window.innerHeight,
    ),
  );
  await page.screenshot({ path: "test-results/entrance.png" });
  await page.getByRole("link", { name: "Enter our universe" }).click();
  await page.goto("http://127.0.0.1:5173/universe", {
    waitUntil: "domcontentloaded",
  });
  await page.locator(".project-folder").first().waitFor();
  assert.equal(await page.evaluate(() => document.body.style.overflow), "");
  await page.waitForTimeout(1100);
  await page.screenshot({
    path: "test-results/desktop.png",
    fullPage: true,
  });
  assert.equal(await page.locator(".project-folder").count(), 4);
  await page.getByRole("button", { name: "Pause motion" }).click();
  assert.equal(
    await page
      .locator(".star-system")
      .evaluate((e) => e.classList.contains("motion-paused")),
    true,
  );
  assert.ok(
    await page
      .locator(".client-planet")
      .first()
      .evaluate((e) =>
        e.getAnimations().every((a) => a.playState === "paused"),
      ),
  );
  await page.locator(".project-folder").first().click();
  await page.locator(".campaign-summary").waitFor();
  await page.getByRole("button", { name: /Expand artwork/ }).click();
  assert.equal(await page.locator("dialog").evaluate((d) => d.open), true);
  await page.keyboard.press("Escape");
  assert.equal(await page.locator("dialog").evaluate((d) => d.open), false);
  await page.reload();
  await page.locator(".campaign-summary").waitFor();
  await page.waitForTimeout(1100);
  await page.screenshot({
    path: "test-results/client.png",
    fullPage: true,
  });
  await page.goto("http://127.0.0.1:5173/work");
  await page.locator(".project-folder").first().waitFor();
  await page
    .getByRole("button", { name: "Social Media Advertising", exact: true })
    .click();
  assert.equal(await page.locator(".project-folder").count(), 4);
  await page
    .getByRole("button", { name: "All projects", exact: false })
    .click();
  assert.ok(await page.locator(".mission-index").isVisible());
  await page.getByRole("button", { name: "All work", exact: true }).click();
  assert.equal(await page.locator(".project-folder").count(), 24);
  for (const width of [390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const route of [
      "/universe",
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
  await page.goto("http://127.0.0.1:5173/universe", {
    waitUntil: "domcontentloaded",
  });
  await page.locator(".project-folder").first().waitFor();
  await page.waitForTimeout(1100);
  await page.screenshot({
    path: "test-results/mobile.png",
    fullPage: true,
  });
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
  await page.waitForTimeout(1100);
  await page.screenshot({
    path: "test-results/light.png",
    fullPage: true,
  });
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
  // Keyboard flight deck searches all campaigns and supports direct travel.
  await page.keyboard.press("Control+k");
  await page
    .getByRole("textbox", { name: "Find a world or campaign" })
    .fill("NOCTURNE");
  assert.equal(await page.locator(".flight-result").count(), 2);
  await page.locator(".flight-result").first().click();
  await page.locator(".campaign-summary").waitFor();
  assert.ok(page.url().includes("/work/demo-nocturne?campaign="));
  await page.goto("http://127.0.0.1:5173/universe");
  await page.locator(".client-planet").first().waitFor();
  await page.getByRole("button", { name: "Scan the Adliens universe" }).click();
  assert.ok(
    await page
      .locator(".star-system")
      .evaluate((e) => e.classList.contains("is-scanning")),
  );
  await page.getByRole("button", { name: "Random jump" }).click();
  await page.locator(".campaign-summary").waitFor();
  assert.ok(page.url().includes("?campaign="));
  // Exercise a partial final sector.
  await page.goto("http://127.0.0.1:5173/work");
  await page.locator(".client-planet").first().waitFor();
  await page.evaluate(() => {
    const db = JSON.parse(localStorage.getItem("adliens-admin-db-v1"));
    for (let i = 0; i < 1; i++)
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
  await page.getByRole("button", { name: "Sector 4", exact: true }).click();
  assert.equal(await page.locator(".client-planet").count(), 1);
  await page.getByRole("button", { name: "Previous sector" }).click();
  assert.equal(await page.locator(".client-planet").count(), 4);
  await page.waitForTimeout(1100);
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
  assert.equal(await page.locator(".client-planet").count(), 4);
  assert.deepEqual(errors, []);
  console.log(
    "PASS: planets, motion pause, deep links, dialog/Escape, filters, views, 18 responsive route checks, mobile menu, light theme, reduced motion, multi-sector collections, error recovery, flight deck, random jumps, and scan interaction; no runtime errors",
  );
  await browser.close();
  server.kill();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});

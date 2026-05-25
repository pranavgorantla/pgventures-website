import { test } from "@playwright/test";
import path from "path";

const OUT = path.resolve("screenshots");

type Theme = "dark" | "light";

async function setTheme(page: import("@playwright/test").Page, theme: Theme) {
  await page.addInitScript((t) => { localStorage.setItem("theme", t); }, theme);
}

async function goto(page: import("@playwright/test").Page, url: string) {
  await page.goto(url, { waitUntil: "networkidle", timeout: 20000 });
  await page.waitForTimeout(600);
}

// ── Before atmosphere (captured before any changes were made) ───────────────
// Already captured — these are archived in screenshots/ from pre-change run.

// ── Full review page (all 3 hero options + 2 gear treatments, full height) ──
test("review-full-dark", async ({ page }) => {
  await setTheme(page, "dark");
  await goto(page, "/review");
  await page.waitForTimeout(3500); // gears section needs animation time
  await page.screenshot({ path: path.join(OUT, "review-full-dark.png"), fullPage: true });
});
test("review-full-light", async ({ page }) => {
  await setTheme(page, "light");
  await goto(page, "/review");
  await page.waitForTimeout(3500);
  await page.screenshot({ path: path.join(OUT, "review-full-light.png"), fullPage: true });
});

// ── Hero — each option captured individually by scrolling to its section ────
async function shotHeroOption(
  page: import("@playwright/test").Page,
  theme: Theme,
  idx: number,   // 0=OptionA, 1=OptionB, 2=OptionC
  file: string,
) {
  await setTheme(page, theme);
  await goto(page, "/review");
  // Each section is min-h-screen; scroll to the right one
  await page.evaluate((i) => {
    const sections = document.querySelectorAll("main > div[class*='relative border-b'], main > div[class*='border-b']");
    const heroSections = Array.from(sections).filter((_, idx2) => idx2 < 3);
    heroSections[i]?.scrollIntoView({ behavior: "instant" });
  }, idx);
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(OUT, file), fullPage: false });
}

test("hero-option-a-dark",  async ({ page }) => shotHeroOption(page, "dark",  0, "hero-option-a-dark.png"));
test("hero-option-a-light", async ({ page }) => shotHeroOption(page, "light", 0, "hero-option-a-light.png"));
test("hero-option-b-dark",  async ({ page }) => shotHeroOption(page, "dark",  1, "hero-option-b-dark.png"));
test("hero-option-b-light", async ({ page }) => shotHeroOption(page, "light", 1, "hero-option-b-light.png"));
test("hero-option-c-dark",  async ({ page }) => shotHeroOption(page, "dark",  2, "hero-option-c-dark.png"));
test("hero-option-c-light", async ({ page }) => shotHeroOption(page, "light", 2, "hero-option-c-light.png"));

// ── Gears — screenshot the FeedbackLoopGears section on the homepage ─────────
async function shotGears(
  page: import("@playwright/test").Page,
  theme: Theme,
  file: string,
) {
  await setTheme(page, theme);
  await goto(page, "/");
  const section = page.locator('[aria-label="The feedback loop"]').first();
  await section.scrollIntoViewIfNeeded();
  await page.waitForTimeout(3500); // let gear animation complete
  await section.screenshot({ path: path.join(OUT, file) });
}

test("gears-treatment-1-dark",  async ({ page }) => shotGears(page, "dark",  "gears-treatment-1-dark.png"));
test("gears-treatment-1-light", async ({ page }) => shotGears(page, "light", "gears-treatment-1-light.png"));

// ── Engagement models — scroll to section on consulting page ─────────────────
async function shotModels(
  page: import("@playwright/test").Page,
  theme: Theme,
  file: string,
) {
  await setTheme(page, theme);
  await goto(page, "/consulting");
  const section = page.locator('[aria-label="Engagement models"]').first();
  await section.scrollIntoViewIfNeeded();
  await page.waitForTimeout(700);
  await section.screenshot({ path: path.join(OUT, file) });
}

test("engagement-models-dark",  async ({ page }) => shotModels(page, "dark",  "engagement-models-dark.png"));
test("engagement-models-light", async ({ page }) => shotModels(page, "light", "engagement-models-light.png"));

// ── Atmosphere before/after (homepage viewport, archived) ───────────────────
test("after-atmosphere-dark",  async ({ page }) => {
  await setTheme(page, "dark");
  await goto(page, "/");
  await page.screenshot({ path: path.join(OUT, "after-atmosphere-dark.png"), fullPage: false });
});
test("after-atmosphere-light", async ({ page }) => {
  await setTheme(page, "light");
  await goto(page, "/");
  await page.screenshot({ path: path.join(OUT, "after-atmosphere-light.png"), fullPage: false });
});

// ── Responsive hero ──────────────────────────────────────────────────────────
test("hero-mobile-dark",  async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await setTheme(page, "dark");
  await goto(page, "/");
  await page.screenshot({ path: path.join(OUT, "hero-mobile-dark.png"), fullPage: false });
});
test("hero-tablet-dark", async ({ page }) => {
  await page.setViewportSize({ width: 768, height: 1024 });
  await setTheme(page, "dark");
  await goto(page, "/");
  await page.screenshot({ path: path.join(OUT, "hero-tablet-dark.png"), fullPage: false });
});

// ── Gear Treatment 2 — captured from /review page ────────────────────────────
async function shotGearsTreatment2(
  page: import("@playwright/test").Page,
  theme: "dark" | "light",
  file: string,
) {
  await setTheme(page, theme);
  await goto(page, "/review");
  // Treatment 2 is the last section on the review page
  const t2 = page.locator('[aria-label="The feedback loop"]').last();
  await t2.scrollIntoViewIfNeeded();
  await page.waitForTimeout(3500);
  await t2.screenshot({ path: path.join(OUT, file) });
}

test("gears-treatment-2-dark",  async ({ page }) => shotGearsTreatment2(page, "dark",  "gears-treatment-2-dark.png"));
test("gears-treatment-2-light", async ({ page }) => shotGearsTreatment2(page, "light", "gears-treatment-2-light.png"));

import { test } from "@playwright/test";
import path from "path";

// Cumulative timestamps: [0, 600, 1200, 1800, 2400, 3000, 4000]
const LABELS = ["0ms", "600ms", "1200ms", "1800ms", "2400ms", "3000ms", "4000ms"];
const WAITS  = [    0,     600,      600,      600,      600,      600,     1000];

async function captureFrames(
  page: import("@playwright/test").Page,
  theme: "dark" | "light",
  vpLabel: string,
) {
  await page.addInitScript((t) => { localStorage.setItem("theme", t); }, theme);
  await page.goto("/", { waitUntil: "domcontentloaded", timeout: 15000 });
  await page.waitForTimeout(300);

  const hero = page.locator(".relative.min-h-screen").first();

  for (let i = 0; i < LABELS.length; i++) {
    await page.waitForTimeout(WAITS[i]);
    await hero.screenshot({
      path: path.join("screenshots", `hero-${vpLabel}-${LABELS[i]}-${theme}.png`),
    });
  }
}

for (const theme of ["dark", "light"] as const) {
  test(`hero-frames-${theme}`, async ({ page, viewport }) => {
    const w = viewport?.width ?? 1440;
    const vpLabel = w <= 375 ? "mobile" : w <= 768 ? "tablet" : "desktop";
    await captureFrames(page, theme, vpLabel);
  });
}

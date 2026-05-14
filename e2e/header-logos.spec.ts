import { test } from "@playwright/test";
import path from "path";

const PAGES = [
  { name: "ventures", url: "/" },
  { name: "technologies", url: "/technologies" },
  { name: "consulting", url: "/consulting" },
];

const THEMES = ["dark", "light"] as const;

test.describe("Header logo screenshots", () => {
  for (const theme of THEMES) {
    for (const page of PAGES) {
      test(`header-${page.name}-${theme}`, async ({ page: pw, viewport }) => {
        const vp = viewport?.width ?? 1440;
        const label = vp <= 375 ? "mobile" : "desktop";

        // Set theme in localStorage before page load so next-themes picks it up
        await pw.addInitScript((t) => {
          localStorage.setItem("theme", t);
        }, theme);

        await pw.goto(page.url, { waitUntil: "load", timeout: 15000 });
        // Wait for hydration + theme application
        await pw.waitForTimeout(500);

        // Screenshot the header region only
        const header = pw.locator("header").first();
        await header.screenshot({
          path: path.join("screenshots", `header-${page.name}-${label}-${theme}.png`),
        });
      });
    }
  }
});

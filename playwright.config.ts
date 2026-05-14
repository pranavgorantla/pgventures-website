import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  use: {
    baseURL: "http://localhost:3001",
  },
  webServer: {
    command: "echo 'server already running'",
    url: "http://localhost:3001",
    reuseExistingServer: true,
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } } },
    { name: "tablet",  use: { ...devices["iPad Pro"],       viewport: { width: 768,  height: 1024 } } },
    { name: "mobile",  use: { ...devices["Pixel 5"],        viewport: { width: 375,  height: 812 } } },
  ],
});

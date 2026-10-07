import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  testMatch: "direct-access.spec.ts",
  use: {
    baseURL: "http://localhost:8080",
    viewport: { width: 1280, height: 1800 },
    headless: true,
  },
  webServer: {
    command: "bun run dev",
    url: "http://localhost:8080",
    reuseExistingServer: true,
    timeout: 60_000,
  },
});

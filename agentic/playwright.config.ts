import { defineConfig } from '@playwright/test';

// Runs tests/site.spec.ts against a fresh build of the site.
//   npm run test:site
// CHROMIUM=/path/to/chrome uses a specific browser binary.

const PORT = Number(process.env.PORT) || 8123;

export default defineConfig({
  testDir: 'tests',
  fullyParallel: true,
  reporter: [['list']],
  use: {
    baseURL: `http://127.0.0.1:${PORT}`,
    trace: 'off',
    launchOptions: process.env.CHROMIUM ? { executablePath: process.env.CHROMIUM } : {}
  },
  webServer: {
    command: `SERVE_ONLY=1 PORT=${PORT} node build/dev.mjs`,
    url: `http://127.0.0.1:${PORT}/`,
    reuseExistingServer: false,
    timeout: 60_000
  }
});

import { defineConfig } from '@playwright/test';
import { createPasswordHash } from './src/lib/server/auth/password';

export const PLAYWRIGHT_ADMIN_PASSWORD = 'soulprompts-playwright-owner';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: false,
  workers: 1,
  use: {
    baseURL: 'http://127.0.0.1:4173',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure'
  },
  webServer: {
    command: 'npm run dev -- --host 127.0.0.1 --port 4173',
    port: 4173,
    reuseExistingServer: !process.env.CI,
    env: {
      ...process.env,
      NODE_ENV: 'development',
      PUBLIC_SITE_URL: 'http://127.0.0.1:4173',
      ADMIN_PASSWORD_HASH: createPasswordHash(PLAYWRIGHT_ADMIN_PASSWORD),
      ADMIN_SESSION_SECRET: 'playwright-session-secret',
      CMS_ENABLE_IN_MEMORY_FALLBACK: 'true'
    }
  }
});

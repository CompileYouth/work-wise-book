import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './tests/browser',
  workers: 1,
  reporter: 'list',
  use: { baseURL: process.env.SITE_URL || 'http://127.0.0.1:4173/work-wise-book/', channel: 'chrome' },
  webServer: process.env.SITE_URL ? undefined : {
    command: 'npm run preview -- --host 127.0.0.1 --port 4173',
    url: 'http://127.0.0.1:4173/work-wise-book/',
    reuseExistingServer: !process.env.CI
  }
})

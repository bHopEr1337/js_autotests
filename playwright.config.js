// @ts-check
import { defineConfig, devices } from '@playwright/test';


/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [['list']],
  // Хук для открытия отчёта после завершения всех тестов
  globalTeardown: './globalTeardown.js',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  timeout: 400000,
  use: {
    browserName: 'chromium', // Указываем, что используем только Chromium
    headless: true, // Запуск в режиме с отображением браузера (опционально)
  },
  projects: [
    {
      name: 'chromium', // Название проекта (опционально)
      use: { browserName: 'chromium' }, // Указываем, что используем только Chromium
    },
  ],
});


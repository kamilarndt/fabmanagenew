import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
    testDir: './tests',
    testMatch: ['**/*.spec.ts'],
    timeout: 30_000,
    retries: 0,
    use: {
        baseURL: 'http://localhost:5173',
        trace: 'on-first-retry'
    },
    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] }
        }
    ],
    webServer: {
        command: 'npm run preview -- --port 5173 --strictPort',
        url: 'http://localhost:5173',
        reuseExistingServer: true,
        timeout: 120_000
    }
})



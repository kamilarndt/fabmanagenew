import { defineConfig } from 'vitest/config'

export default defineConfig({
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: './vitest.setup.ts',
        // Exclude Playwright E2E tests from Vitest collection
        exclude: [
            '**/node_modules/**',
            '**/dist/**',
            '**/tests/**',
            '!**/tests/unit/**'
        ]
    }
})


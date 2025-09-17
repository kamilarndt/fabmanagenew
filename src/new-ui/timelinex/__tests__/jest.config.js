module.exports = {
  displayName: 'TimelineX Tests',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/setup.ts'],
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/../../$1',
    '^@/new-ui/(.*)$': '<rootDir>/../$1',
  },
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  testMatch: [
    '<rootDir>/**/*.test.tsx',
    '<rootDir>/**/*.test.ts',
  ],
  collectCoverageFrom: [
    '../**/*.{ts,tsx}',
    '!../**/*.d.ts',
    '!../**/*.stories.tsx',
    '!../**/__tests__/**',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};

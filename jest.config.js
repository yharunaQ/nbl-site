const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './',
});

/** @type {import('jest').Config} */
const customJestConfig = {
  testEnvironment: 'jest-environment-jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  modulePathIgnorePatterns: ['<rootDir>/.claude/', '<rootDir>/.codex/'],
  testPathIgnorePatterns: ['/node_modules/', '/.next/', '/.claude/', '/.codex/'],
  watchPathIgnorePatterns: ['<rootDir>/.claude/', '<rootDir>/.codex/'],
};

module.exports = createJestConfig(customJestConfig);

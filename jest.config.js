/** @type {import('jest').Config} */
module.exports = { testEnvironment: 'jsdom', setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'], moduleNameMapper: { '^@/(.*)$': '<rootDir>/$1' }, testPathIgnorePatterns: ['/node_modules/', '/.next/'] };

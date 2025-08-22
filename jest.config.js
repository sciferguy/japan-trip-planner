/** @type {import('jest').Config} */
  module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    roots: ['<rootDir>'],
    testMatch: [
      '**/__tests__/**/*.test.ts',
      '**/?(*.)+(spec|test).ts'
    ],
    transform: {
      '^.+\\.ts$': 'ts-jest'
    },
    moduleNameMapper: {
      '^@/(.*)$': '<rootDir>/$1'
    },
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
    transformIgnorePatterns: [
      'node_modules/(?!(next-auth|@auth/core|@auth/prisma-adapter)/)'
    ],
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
    collectCoverageFrom: [
      '**/*.{ts,tsx}',
      '!**/*.d.ts',
      '!**/node_modules/**'
    ]
  }
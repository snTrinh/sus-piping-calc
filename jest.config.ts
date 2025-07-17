// jest.config.js
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node', // Or 'jsdom' if you're testing React components
    roots: ['<rootDir>/src'], // Tell Jest where to find your source files
    testMatch: [
      '**/__tests__/**/*.+(ts|tsx|js)', // Matches files in __tests__ directories
      '**/?(*.)+(spec|test).+(ts|tsx|js)' // Matches files ending with .spec.ts, .test.ts, etc.
    ],
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    // Optional: If you use module aliases (e.g., @/utils)
    moduleNameMapper: {
      '^@/(.*)$': '<rootDir>/src/$1',
    },
  };
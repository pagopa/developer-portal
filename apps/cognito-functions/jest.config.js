/** @type {import('jest').Config} */
const config = {
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.+(ts)'],
  moduleFileExtensions: ['ts', 'js'],
  transform: {
    '^.+\\.(ts)$': 'ts-jest',
  },
  coverageThreshold: {
    global: {
      branches: 70,
      lines: 70,
    },
  },
};

module.exports = config;

import type { JestConfigWithTsJest } from 'ts-jest';

const jestConfig: JestConfigWithTsJest = {
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.+(ts)'],
  moduleFileExtensions: ['ts', 'js'],
  modulePathIgnorePatterns: ['./*/__tests__/data.ts'],
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

export default jestConfig;

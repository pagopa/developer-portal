import type { JestConfigWithTsJest } from 'ts-jest';

const jestConfig: JestConfigWithTsJest = {
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.+(ts|tsx)'],
  modulePathIgnorePatterns: ['<rootDir>/src/__tests__/fixtures/*'],
  moduleFileExtensions: ['ts', 'js', 'tsx'],
  transform: {
    // See the discussion https://github.com/vercel/next.js/issues/8663
    '^.+\\.(ts|tsx)$': ['ts-jest', { tsconfig: 'tsconfig.jest.json' }],
  },
};

export default jestConfig;

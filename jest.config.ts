import type { JestConfigWithTsJest } from 'ts-jest';

const jestConfig: JestConfigWithTsJest = {
  roots: ['<rootDir>/src'],
  testMatch: [
    '**/__tests__/**/*.+(ts|tsx)',
    '**/?(*.)+(spec|test).+(ts|tsx)',
    'test',
  ],
  moduleFileExtensions: ['ts', 'js', 'tsx'],
  modulePathIgnorePatterns: ['./__tests__/data.ts'],
  transform: {
    // See the discussion https://github.com/vercel/next.js/issues/8663
    '^.+\\.(ts|tsx)$': ['ts-jest', { tsconfig: 'tsconfig.jest.json' }],
  },
  coverageThreshold: {
    global: {
      branches: 70,
      lines: 70,
    },
  },
};

export default jestConfig;

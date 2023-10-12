import type { JestConfigWithTsJest } from 'ts-jest';

const jestConfig: JestConfigWithTsJest = {
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.+(ts|tsx)'],
  moduleFileExtensions: ['ts', 'js', 'tsx'],
  transform: {
    // See the discussion https://github.com/vercel/next.js/issues/8663
    '^.+\\.(ts|tsx)$': ['ts-jest', { tsconfig: 'tsconfig.jest.json' }],
  },
  moduleNameMapper: {
    // Needed or else if some test files imports a file from the src folder using the Next naming convention, it will fail.
    // Example: import { shared } from '@/_contents/translations'; returns Cannot find module '@/_contents/translations' from 'src/some-file.ts'
    '@/(.*)': '<rootDir>/src/$1',
  },
  // Needed to load the .env file
  setupFiles: ['dotenv/config'],
};

export default jestConfig;

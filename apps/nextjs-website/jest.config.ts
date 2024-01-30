import type { JestConfigWithTsJest } from 'ts-jest';

const jestConfig: JestConfigWithTsJest = {
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.+(ts|tsx)'],
  moduleFileExtensions: ['ts', 'js', 'tsx'],
  testEnvironment: 'jsdom',
  transform: {
    // See the discussion https://github.com/vercel/next.js/issues/8663
    '^.+\\.(ts|tsx)$': ['ts-jest', { tsconfig: 'tsconfig.jest.json' }],
  },
  moduleNameMapper: {
    // Needed or else if some test files imports a file from the src folder using the Next naming convention, it will fail.
    // Example: import { shared } from '@/_contents/translations'; returns Cannot find module '@/_contents/translations' from 'src/some-file.ts'
    '@/(.*)': '<rootDir>/src/$1',
    // '@fontsource/(.*)': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga|css|less)$':
      '<rootDir>/src/__tests__/__mocks__/fileMock.js',
      "^uuid$": require.resolve("uuid")
  },
};

export default jestConfig;

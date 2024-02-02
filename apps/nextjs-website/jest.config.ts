import type { JestConfigWithTsJest } from 'ts-jest';

const jestConfig: JestConfigWithTsJest = {
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*test.+(ts|tsx)'],
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
    '^uuid$': require.resolve('uuid'),
    // This configuration is used to tell Jest how to handle imports of certain file types in your tests that are not JavaScript or TypeScrip
    // When Jest runs, it replaces any import of the matched file types with this mock file.
    // This is useful because these static files aren't particularly relevant to the tests but are often imported by the modules you're testing.
    // By mapping these imports to a mock file, you can avoid errors that might occur when Jest tries to parse these static files.
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga|css|less)$':
      '<rootDir>/src/__tests__/__mocks__/fileMock.js',
  },
};

export default jestConfig;

import type { Config } from 'jest';

const config: Config = {
  rootDir: __dirname,
  testRegex: 'tests/.*\\.test\\.ts$',
  transform: {
    '^.+\\.ts$': ['ts-jest', { tsconfig: 'tsconfig.json' }],
  },
  testEnvironment: 'node',
  clearMocks: true,
  verbose: false,
};

export default config;

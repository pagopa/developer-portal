import nextJest from 'next/jest';

const createJestConfig = nextJest({
  dir: './',
});

// Add any custom config to be passed to Jest
const customJestConfig = {
  moduleDirectories: ['node_modules', '<rootDir>/'],
  moduleFileExtensions: ['ts', 'tsx', 'js'],
  testEnvironment: 'jest-environment-jsdom',
};

export default createJestConfig(customJestConfig);

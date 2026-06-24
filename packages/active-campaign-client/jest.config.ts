import * as dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config({ path: '.env' });

module.exports = {
  preset: 'ts-jest',
  roots: ['<rootDir>/src'],
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.+(ts)'],
};

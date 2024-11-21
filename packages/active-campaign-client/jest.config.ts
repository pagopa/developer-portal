import * as dotenv from 'dotenv';

// Load environment variables from .env.test file
dotenv.config({ path: '.env' });

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
};

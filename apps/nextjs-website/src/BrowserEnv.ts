import { WebinarEnv } from './lib/webinars/webinarQuestions';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { makeAwsCredentialsFromCognito } from './lib/makeAwsCredentialsFromCognito';
import { Auth } from 'aws-amplify';
import { BrowserConfig } from '@/BrowserConfig';

// This type represents the environment of the application. It contains
// configuration as well as other dependencies required by the application. In
// other words contains all runtime configuration and global functions that may
// be mockable
export type BrowserEnv = {
  readonly config: BrowserConfig;
} & WebinarEnv;

// given environment variables produce an BrowserEnv
export const makeBrowserEnv = (config: BrowserConfig): BrowserEnv => ({
  config,
  questionLifetimeInSeconds:
    config.NEXT_PUBLIC_WEBINAR_QUESTION_LIFETIME_IN_SECONDS,
  nowDate: () => new Date(),
  dynamoDBClient: new DynamoDBClient({
    region: config.NEXT_PUBLIC_COGNITO_REGION,
    credentials: makeAwsCredentialsFromCognito(
      config,
      // passing Auth.currentSession raise an error because
      // Auth.currentSession is not able to retrieve all the information
      () => Auth.currentSession()
    ),
  }),
});

import { pipe } from 'fp-ts/lib/function';
import * as E from 'fp-ts/lib/Either';
import { Config, makeConfig, publicEnv } from './config';
import { WebinarEnv } from './lib/webinars/webinarQuestions';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { makeAwsCredentialsFromCognito } from './lib/makeAwsCredentialsFromCognito';
import { Auth } from 'aws-amplify';

// This type represents the environment of the application. It contains
// configuration as well as other dependencies required by the application. In
// other words contains all runtime configuration and global functions that may
// be mockable
export type AppEnv = {
  readonly config: Config;
} & WebinarEnv;

// given environment variables produce an AppEnv
const makeAppEnv = (
  env: Record<string, undefined | string>
): E.Either<string, AppEnv> =>
  pipe(
    makeConfig(env),
    E.map((config) => ({
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
    }))
  );

// an AppEnv instance ready to be used
export const appEnv = pipe(
  makeAppEnv(publicEnv),
  E.getOrElseW((errors) => {
    // eslint-disable-next-line functional/no-throw-statements
    throw errors;
  })
);

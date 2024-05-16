import { pipe } from 'fp-ts/lib/function';
import * as RTE from 'fp-ts/lib/ReaderTaskEither';
import * as TE from 'fp-ts/lib/TaskEither';
import * as R from 'fp-ts/lib/Reader';
import * as RA from 'fp-ts/lib/ReadonlyArray';
import * as E from 'fp-ts/lib/Either';
import {
  DeleteItemCommand,
  DynamoDBClient,
  PutItemCommand,
  QueryCommand,
} from '@aws-sdk/client-dynamodb';
import {
  WebinarSubscriptionDynamodbCodec,
  makeWebinarSubscriptionFromDynamodbItem,
} from './dynamodb/codec';

export type WebinarEnv = {
  readonly dynamoDBClient: DynamoDBClient;
  readonly nowDate: () => Date;
};

export type WebinarSubscription = {
  readonly webinarId: string;
  readonly username: string;
  readonly createdAt: Date;
};

export const insertWebinarSubscription = (
  webinarId: string,
  username: string
) =>
  pipe(
    // take dynamoDBClient and nowDate properties from WebinarEnv
    R.ask<Pick<WebinarEnv, 'dynamoDBClient' | 'nowDate'>>(),
    R.map(({ dynamoDBClient, nowDate }) => {
      const createdAt = nowDate();
      // create put command
      const putCommand = new PutItemCommand({
        TableName: 'WebinarSubscriptions',
        Item: {
          webinarId: { S: webinarId },
          username: { S: username },
          createdAt: { S: createdAt.toISOString() },
        },
      });
      return TE.tryCatch(() => dynamoDBClient.send(putCommand), E.toError);
    }),
    // do not return (i.e., discard) the result if the operation succeded
    RTE.map(() => void 0)
  );

export const deleteWebinarSubscription = (
  webinarId: string,
  username: string
) =>
  pipe(
    R.ask<Pick<WebinarEnv, 'dynamoDBClient'>>(),
    R.map(({ dynamoDBClient }) => {
      const deleteCommand = new DeleteItemCommand({
        TableName: 'WebinarSubscriptions',
        Key: {
          webinarId: { S: webinarId },
          username: { S: username },
        },
      });
      return TE.tryCatch(() => dynamoDBClient.send(deleteCommand), E.toError);
    }),
    // do not return (i.e., discard) the result if the operation succeded
    RTE.map(() => void 0)
  );

export const listUserWebinarSubscriptions = (username: string) =>
  pipe(
    R.ask<Pick<WebinarEnv, 'dynamoDBClient'>>(),
    R.map(({ dynamoDBClient }) => {
      const queryCommand = new QueryCommand({
        TableName: 'WebinarSubscriptions',
        KeyConditionExpression: 'username = :username',
        ExpressionAttributeValues: {
          ':username': { S: username },
        },
      });
      return TE.tryCatch(() => dynamoDBClient.send(queryCommand), E.toError);
    }),
    RTE.chainEitherK(({ Items }) =>
      pipe(
        // turn undefined to empty array
        Items || [],
        // decode the response
        RA.map(WebinarSubscriptionDynamodbCodec.decode),
        // turn Array<Either<_, _>> to Either<_, Array<_>>
        RA.sequence(E.Applicative),
        // map errors to error and dynamodb item to WebinarQuestion
        E.bimap(E.toError, RA.map(makeWebinarSubscriptionFromDynamodbItem))
      )
    )
  );

import { pipe } from 'fp-ts/lib/function';
import * as RTE from 'fp-ts/lib/ReaderTaskEither';
import * as RA from 'fp-ts/lib/ReadonlyArray';
import * as TE from 'fp-ts/lib/TaskEither';
import * as R from 'fp-ts/lib/Reader';
import * as E from 'fp-ts/lib/Either';
import {
  DynamoDBClient,
  PutItemCommand,
  QueryCommand,
  UpdateItemCommand,
} from '@aws-sdk/client-dynamodb';
import {
  WebinarQuestionDynamodbCodec,
  makeDynamodbItemFromWebinarQuestion,
  makeWebinarQuestionFromDynamodbItem,
  makeWebinarQuestionListQueryCondition,
} from './dynamodb/codec';

export type WebinarEnv = {
  readonly dynamoDBClient: DynamoDBClient;
  readonly nowDate: () => Date;
};

export type InsertWebinarQuestion = Omit<
  WebinarQuestion,
  'createdAt' | 'expireAt'
>;

export type WebinarQuestion = {
  readonly webinarId: string;
  readonly question: string;
  readonly createdAt: Date;
  readonly hiddenBy?: string;
  readonly highlightedBy?: string;
};

export const insertWebinarQuestion = (question: InsertWebinarQuestion) =>
  pipe(
    R.ask<Pick<WebinarEnv, 'dynamoDBClient' | 'nowDate'>>(),
    R.map(({ dynamoDBClient, nowDate }) => {
      const createdAt = nowDate();
      // create put command
      const putCommand = new PutItemCommand({
        TableName: 'WebinarQuestions',
        Item: makeDynamodbItemFromWebinarQuestion({
          webinarId: question.webinarId,
          createdAt: createdAt,
          question: question.question,
        }),
      });
      return TE.tryCatch(() => dynamoDBClient.send(putCommand), E.toError);
    }),
    RTE.map(() => void 0)
  );

export const highlightWebinarQuestion = (
  question: WebinarQuestion,
  highlight: boolean,
  highlightedBy: string
) =>
  pipe(
    R.ask<Pick<WebinarEnv, 'dynamoDBClient'>>(),
    R.map(({ dynamoDBClient }) => {
      const updateCommand = new UpdateItemCommand({
        TableName: 'WebinarQuestions',
        Key: {
          webinarId: { S: question.webinarId },
          createdAt: { S: question.createdAt.toISOString() },
        },
        UpdateExpression: 'SET #highlightedBy = :highlightedBy',
        ExpressionAttributeNames: {
          '#highlightedBy': 'highlightedBy',
        },
        ExpressionAttributeValues: {
          ':highlightedBy': { S: highlight ? highlightedBy : '' },
        },
      });
      return TE.tryCatch(() => dynamoDBClient.send(updateCommand), E.toError);
    }),
    RTE.map(() => void 0)
  );

export const hideWebinarQuestion = (
  question: WebinarQuestion,
  hide: boolean,
  hiddenBy: string
) =>
  pipe(
    R.ask<Pick<WebinarEnv, 'dynamoDBClient'>>(),
    R.map(({ dynamoDBClient }) => {
      const updateCommand = new UpdateItemCommand({
        TableName: 'WebinarQuestions',
        Key: {
          webinarId: { S: question.webinarId },
          createdAt: { S: question.createdAt.toISOString() },
        },
        UpdateExpression: 'SET #hiddenBy = :hiddenBy',
        ExpressionAttributeNames: {
          '#hiddenBy': 'hiddenBy',
        },
        ExpressionAttributeValues: {
          ':hiddenBy': { S: hide ? hiddenBy : '' },
        },
      });
      return TE.tryCatch(() => dynamoDBClient.send(updateCommand), E.toError);
    }),
    RTE.map(() => void 0)
  );

export const listWebinarQuestions = (webinarId: string) =>
  pipe(
    R.ask<Pick<WebinarEnv, 'dynamoDBClient'>>(),
    R.map(({ dynamoDBClient }) => {
      const queryCommand = new QueryCommand({
        TableName: 'WebinarQuestions',
        ...makeWebinarQuestionListQueryCondition(webinarId),
      });
      return TE.tryCatch(() => dynamoDBClient.send(queryCommand), E.toError);
    }),
    RTE.chainEitherK(({ Items }) =>
      pipe(
        // turn undefined to empty array
        Items || [],
        // decode the response
        RA.map(WebinarQuestionDynamodbCodec.decode),
        // turn Array<Either<_, _>> to Either<_, Array<_>>
        RA.sequence(E.Applicative),
        // map errors to error and dynamodb item to WebinarQuestion
        E.bimap(E.toError, RA.map(makeWebinarQuestionFromDynamodbItem))
      )
    )
  );

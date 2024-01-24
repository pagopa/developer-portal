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
} from '@aws-sdk/client-dynamodb';
import {
  WebinarQuestionDynamodbCodec,
  makeDynamodbItemFromWebinarQuestion,
  makeWebinarQuestionFromDynamodbItem,
  makeWebinarQuestionListQueryCondition,
} from './dynamodb/codec';

export type WebinarEnv = {
  readonly questionLifetimeInSeconds: number;
  readonly dynamoDBClient: DynamoDBClient;
  readonly nowDate: () => Date;
};

export type InsertWebinarQuestion = Omit<
  WebinarQuestion,
  'createdAt' | 'expireAt'
>;

export type WebinarQuestion = {
  readonly webinarId: string;
  readonly givenName: string;
  readonly familyName: string;
  readonly question: string;
  readonly createdAt: Date;
  readonly expireAt: Date;
};

export const insertWebinarQuestion = (question: InsertWebinarQuestion) =>
  pipe(
    R.ask<
      Pick<
        WebinarEnv,
        'dynamoDBClient' | 'nowDate' | 'questionLifetimeInSeconds'
      >
    >(),
    R.map(({ dynamoDBClient, nowDate, questionLifetimeInSeconds }) => {
      const createdAt = nowDate();
      // calculate the expireAt time
      const expireAt = new Date(
        createdAt.getTime() + questionLifetimeInSeconds * 1000
      );
      // create put command
      const putCommand = new PutItemCommand({
        TableName: 'WebinarQuestions',
        Item: makeDynamodbItemFromWebinarQuestion({
          webinarId: question.webinarId,
          createdAt: createdAt,
          givenName: question.givenName,
          familyName: question.familyName,
          question: question.question,
          expireAt: expireAt,
        }),
      });
      return TE.tryCatch(() => dynamoDBClient.send(putCommand), E.toError);
    }),
    RTE.map(() => void 0)
  );

export const listWebinarQuestion = (webinarId: string) =>
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

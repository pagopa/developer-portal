import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import { WebinarQuestion } from '../webinarQuestions';
import { QueryCommandInput } from '@aws-sdk/client-dynamodb';

const DynamodbAttrS = t.strict({
  S: t.string,
});
const DynamodbAttrISODate = t.strict({
  S: tt.DateFromISOString,
});
const DynamodbAttrUnixTime = t.strict({
  N: tt.NumberFromString.pipe(tt.DateFromUnixTime),
});

export const WebinarQuestionDynamodbCodec = t.strict({
  webinarId: DynamodbAttrS,
  createdAt: DynamodbAttrISODate,
  givenName: DynamodbAttrS,
  familyName: DynamodbAttrS,
  question: DynamodbAttrS,
  expireAt: DynamodbAttrUnixTime,
});

type WebinarQuestionDynamoDB = t.TypeOf<typeof WebinarQuestionDynamodbCodec>;

export const makeWebinarQuestionListQueryCondition = (
  webinarId: string
): Pick<
  QueryCommandInput,
  'KeyConditionExpression' | 'ExpressionAttributeValues'
> => ({
  KeyConditionExpression: 'webinarId = :webinarId',
  ExpressionAttributeValues: { ':webinarId': { S: webinarId } },
});

export const makeWebinarQuestionFromDynamodbItem = (
  input: WebinarQuestionDynamoDB
): WebinarQuestion => ({
  webinarId: input.webinarId.S,
  givenName: input.givenName.S,
  familyName: input.familyName.S,
  question: input.question.S,
  createdAt: input.createdAt.S,
  expireAt: input.expireAt.N,
});

export const makeDynamodbItemFromWebinarQuestion = (input: WebinarQuestion) =>
  WebinarQuestionDynamodbCodec.encode({
    webinarId: { S: input.webinarId },
    createdAt: { S: input.createdAt },
    givenName: { S: input.givenName },
    familyName: { S: input.familyName },
    question: { S: input.question },
    // must be in unix epoch time format
    expireAt: { N: input.expireAt },
  });

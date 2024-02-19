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

export const WebinarQuestionDynamodbCodec = t.strict({
  webinarId: DynamodbAttrS,
  createdAt: DynamodbAttrISODate,
  question: DynamodbAttrS,
  hiddenBy: DynamodbAttrS,
  hiddenByFullName: DynamodbAttrS,
  highlightedBy: DynamodbAttrS,
  highlightedByFullName: DynamodbAttrS,
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
  question: input.question.S,
  createdAt: input.createdAt.S,
  hiddenBy: input.hiddenBy.S,
  hiddenByFullName: input.hiddenByFullName.S,
  highlightedBy: input.highlightedBy.S,
  highlightedByFullName: input.highlightedByFullName.S,
});

export const makeDynamodbItemFromWebinarQuestion = (input: WebinarQuestion) =>
  WebinarQuestionDynamodbCodec.encode({
    webinarId: { S: input.webinarId },
    createdAt: { S: input.createdAt },
    question: { S: input.question },
    hiddenBy: { S: input.hiddenBy ?? '' },
    hiddenByFullName: { S: input.hiddenByFullName ?? '' },
    highlightedBy: { S: input.highlightedBy ?? '' },
    highlightedByFullName: { S: input.highlightedByFullName ?? '' },
  });

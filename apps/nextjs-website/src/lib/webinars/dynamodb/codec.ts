import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import { WebinarQuestion } from '../webinarQuestions';
import { QueryCommandInput } from '@aws-sdk/client-dynamodb';

const DynamodbAttrNull = t.strict({ NULL: t.boolean });
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
  hiddenBy: t.union([t.undefined, DynamodbAttrS, DynamodbAttrNull]),
  highlightedBy: t.union([t.undefined, DynamodbAttrS, DynamodbAttrNull]),
});

type DynamodbAttrNullType = t.TypeOf<typeof DynamodbAttrNull>;
type DynamodbAttrSType = t.TypeOf<typeof DynamodbAttrS>;
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
  // The fields hiddenBy and highlightedBy can be undefined, { N: true } or { S: "string" }
  hiddenBy:
    !input.hiddenBy || (input.hiddenBy as unknown as DynamodbAttrNullType).NULL
      ? undefined
      : (input.hiddenBy as unknown as DynamodbAttrSType).S,
  highlightedBy:
    !input.highlightedBy ||
    (input.highlightedBy as unknown as DynamodbAttrNullType).NULL
      ? undefined
      : (input.highlightedBy as unknown as DynamodbAttrSType).S,
});

export const makeDynamodbItemFromWebinarQuestion = (input: WebinarQuestion) =>
  WebinarQuestionDynamodbCodec.encode({
    webinarId: { S: input.webinarId },
    createdAt: { S: input.createdAt },
    question: { S: input.question },
    hiddenBy: input.hiddenBy ? { S: input.hiddenBy } : { NULL: true },
    highlightedBy: input.highlightedBy
      ? { S: input.highlightedBy }
      : { NULL: true },
  });

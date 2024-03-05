import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import {
  UpdateExpression,
  WebinarQuestion,
  WebinarQuestionUpdate,
} from '../webinarQuestions';
import {
  QueryCommandInput,
  UpdateItemCommandInput,
} from '@aws-sdk/client-dynamodb';

const DynamodbAttrS = t.strict({
  S: t.string,
});
const DynamodbAttrISODate = t.strict({
  S: tt.DateFromISOString,
});

export const WebinarQuestionDynamodbCodec = t.intersection([
  t.strict({
    webinarId: DynamodbAttrS,
    createdAt: DynamodbAttrISODate,
    question: DynamodbAttrS,
  }),
  t.partial({
    hiddenBy: DynamodbAttrS,
    highlightedBy: DynamodbAttrS,
  }),
]);

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
  hiddenBy: input.hiddenBy?.S,
  highlightedBy: input.highlightedBy?.S,
});

export const makeDynamodbItemFromWebinarQuestion = (input: WebinarQuestion) =>
  WebinarQuestionDynamodbCodec.encode({
    webinarId: { S: input.webinarId },
    createdAt: { S: input.createdAt },
    question: { S: input.question },
    ...(input.hiddenBy && { hiddenBy: { S: input.hiddenBy } }),
    ...(input.highlightedBy && { highlightedBy: { S: input.highlightedBy } }),
  });

const makeUpdateExpression = <T>(
  fieldName: string,
  expression?: UpdateExpression<T>
) =>
  expression?.operation === 'update'
    ? [`SET #${fieldName} = :${fieldName}`]
    : expression?.operation === 'remove'
    ? [`REMOVE #${fieldName}`]
    : [];

export const makeDynamodbUpdateFromWebinarQuestionUpdate = (
  input: WebinarQuestionUpdate
): Omit<UpdateItemCommandInput, 'TableName'> => {
  const updateItemCommandInput = {
    Key: {
      webinarId: { S: input.webinarId },
      createdAt: { S: input.createdAt.toISOString() },
    },
    ExpressionAttributeNames: {
      ...(input.hiddenBy && { [`#hiddenBy`]: 'hiddenBy' }),
      ...(input.highlightedBy && { [`#highlightedBy`]: 'highlightedBy' }),
    },
    UpdateExpression: [
      ...makeUpdateExpression('hiddenBy', input.hiddenBy),
      ...makeUpdateExpression('highlightedBy', input.highlightedBy),
    ].join(' '),
  };
  const ExpressionAttributeValues = {
    ...(input.hiddenBy?.operation === 'update' && {
      [`:hiddenBy`]: { S: input.hiddenBy.value },
    }),
    ...(input.highlightedBy?.operation === 'update' && {
      [`:highlightedBy`]: { S: input.highlightedBy.value },
    }),
  };
  // ExpressionAttributeValues can not be empty, otherwise the system rise a
  // runtime error
  if (Object.keys(ExpressionAttributeValues).length !== 0)
    return { ...updateItemCommandInput, ExpressionAttributeValues };
  else return updateItemCommandInput;
};

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

type UpdateExpressionItem<T> = {
  readonly fieldName: string;
  readonly expression?: UpdateExpression<T>;
};
const makeUpdateExpression = <T>(
  expressionList: ReadonlyArray<UpdateExpressionItem<T>>
) => {
  const zero = {
    set: [] as readonly string[],
    remove: [] as readonly string[],
  };
  const { set, remove } = expressionList.reduce((acc, curr) => {
    // handle update operations
    if (curr.expression?.operation === 'update') {
      const set = [...acc.set, `${curr.fieldName} = :${curr.fieldName}`];
      return { ...acc, set };
    }
    // handle remove operations
    else if (curr.expression?.operation === 'remove') {
      const remove = [...acc.remove, `${curr.fieldName}`];
      return { ...acc, remove };
    }
    // handle no operations
    else return acc;
  }, zero);

  const setStr = set.length > 0 ? 'SET ' + set.join(' ,') : '';
  const removeStr = remove.length > 0 ? 'REMOVE ' + remove.join(' ,') : '';
  return `${setStr} ${removeStr}`;
};

export const makeDynamodbUpdateFromWebinarQuestionUpdate = (
  input: WebinarQuestionUpdate
): Omit<UpdateItemCommandInput, 'TableName'> => {
  const updateItemCommandInput = {
    Key: {
      webinarId: { S: input.webinarId },
      createdAt: { S: input.createdAt.toISOString() },
    },
    UpdateExpression: makeUpdateExpression([
      { fieldName: 'hiddenBy', expression: input.hiddenBy },
      { fieldName: 'highlightedBy', expression: input.highlightedBy },
    ]),
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

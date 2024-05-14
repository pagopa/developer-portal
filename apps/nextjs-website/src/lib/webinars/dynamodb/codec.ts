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
import { WebinarSubscription } from '../webinarSubscriptions';

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

export const WebinarSubscriptionDynamodbCodec = t.strict({
  webinarId: DynamodbAttrS,
  username: DynamodbAttrS,
});

type WebinarQuestionDynamoDB = t.TypeOf<typeof WebinarQuestionDynamodbCodec>;
type WebinarSubscriptionDynamoDB = t.TypeOf<
  typeof WebinarSubscriptionDynamodbCodec
>;

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
  id: {
    slug: input.webinarId.S,
    createdAt: input.createdAt.S,
  },
  question: input.question.S,
  // use the short-circuit evaluation to omit the attribute if it is undefined
  ...(input.hiddenBy && { hiddenBy: input.hiddenBy.S }),
  ...(input.highlightedBy && { highlightedBy: input.highlightedBy.S }),
});

export const makeWebinarSubscriptionFromDynamodbItem = (
  input: WebinarSubscriptionDynamoDB
): WebinarSubscription => ({
  webinarId: input.webinarId.S,
  username: input.username.S,
});

export const makeDynamodbItemFromWebinarQuestion = (input: WebinarQuestion) =>
  WebinarQuestionDynamodbCodec.encode({
    webinarId: { S: input.id.slug },
    createdAt: { S: input.id.createdAt },
    question: { S: input.question },
    ...(input.hiddenBy && { hiddenBy: { S: input.hiddenBy } }),
    ...(input.highlightedBy && { highlightedBy: { S: input.highlightedBy } }),
  });

export const makeDynamodbItemFromWebinarSubscription = (
  input: WebinarSubscription
) =>
  WebinarSubscriptionDynamodbCodec.encode({
    webinarId: { S: input.webinarId },
    username: { S: input.username },
  });

type UpdateExpressionItem = {
  readonly fieldName: string;
  readonly expression?: UpdateExpression<string>;
};
// Helper function to create UpdateExpression and ExpressionAttributeValues.
// https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Expressions.UpdateExpressions.html
const makeUpdateExpression = (
  expressionList: ReadonlyArray<UpdateExpressionItem>
): Pick<
  UpdateItemCommandInput,
  'UpdateExpression' | 'ExpressionAttributeValues'
> => {
  // define the initialValue of the reduce function
  const initialValue: {
    // the set command; e.g.: set fieldName0 = :fieldName0
    readonly set?: string;
    // the remove command; e.g.: remove fieldName0
    readonly remove?: string;
    // if expressionAttributeValues is empty the system raises a runtime error
    readonly expressionAttributeValues?: UpdateItemCommandInput['ExpressionAttributeValues'];
  } = {};
  // reduce the list of expression to an object that contains set, remove and
  // ExpressionAttributeValues attribute
  const { set, remove, expressionAttributeValues } = expressionList.reduce(
    (acc, curr) => {
      // handle update operations
      if (curr.expression?.operation === 'update') {
        // if set is empty initialize the set command, otherwise append to the existing one
        const prefix = acc.set ? `${acc.set},` : 'set';
        // the syntax is: set fieldName0 = :fieldName0, fieldNameN = :fieldNameN
        const set = `${prefix} ${curr.fieldName} = :${curr.fieldName}`;
        const expressionAttributeValues = {
          ...acc.expressionAttributeValues,
          [`:${curr.fieldName}`]: { S: curr.expression?.value },
        };
        return { ...acc, set, expressionAttributeValues };
      }
      // handle remove operations
      else if (curr.expression?.operation === 'remove') {
        // if remove is empty initialize the remove command, otherwise append to the existing one
        const prefix = acc.remove ? `${acc.remove},` : 'remove';
        // the syntax is: remove fieldName0, fieldNameN
        const remove = `${prefix} ${curr.fieldName}`;
        return { ...acc, remove };
      }
      // handle no operations
      else return acc;
    },
    initialValue
  );
  return {
    UpdateExpression: `${set ?? ''} ${remove ?? ''}`,
    ExpressionAttributeValues: expressionAttributeValues,
  };
};

export const makeDynamodbUpdateFromWebinarQuestionUpdate = (
  input: WebinarQuestionUpdate
): Omit<UpdateItemCommandInput, 'TableName'> => {
  const { UpdateExpression, ExpressionAttributeValues } = makeUpdateExpression([
    { fieldName: 'hiddenBy', expression: input.updates.hiddenBy },
    { fieldName: 'highlightedBy', expression: input.updates.highlightedBy },
  ]);
  return {
    Key: {
      webinarId: { S: input.id.slug },
      createdAt: { S: input.id.createdAt.toISOString() },
    },
    UpdateExpression,
    ExpressionAttributeValues,
  };
};

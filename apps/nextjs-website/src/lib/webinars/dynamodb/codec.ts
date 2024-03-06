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
  // The type of the accumulator of the reduce function
  type Zero = {
    // the set command; e.g.: set fieldName0 = :fieldName0
    readonly set?: string;
    // the remove command; e.g.: remove fieldName0
    readonly remove?: string;
    // if ExpressionAttributeValues is empty the system raises a runtime error
    readonly ExpressionAttributeValues?: UpdateItemCommandInput['ExpressionAttributeValues'];
  };
  const zero: Zero = {};
  // reduce the list of expression to an object that contains set, remove and
  // ExpressionAttributeValues attribute
  const { set, remove, ExpressionAttributeValues } = expressionList.reduce(
    (acc, curr) => {
      // handle update operations
      if (curr.expression?.operation === 'update') {
        // if set is empty initialize the set command, otherwise append to the existing one
        const prefix = acc.set ? `${acc.set},` : 'set';
        // the syntax is: set fieldName0 = :fieldName0, fieldNameN = :fieldNameN
        const set = `${prefix} ${curr.fieldName} = :${curr.fieldName}`;
        const ExpressionAttributeValues = {
          ...acc.ExpressionAttributeValues,
          [`:${curr.fieldName}`]: { S: curr.expression?.value },
        };
        return { ...acc, set, ExpressionAttributeValues };
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
    zero
  );
  return {
    UpdateExpression: `${set ?? ''} ${remove ?? ''}`,
    ExpressionAttributeValues,
  };
};

export const makeDynamodbUpdateFromWebinarQuestionUpdate = (
  input: WebinarQuestionUpdate
): Omit<UpdateItemCommandInput, 'TableName'> => {
  const { UpdateExpression, ExpressionAttributeValues } = makeUpdateExpression([
    { fieldName: 'hiddenBy', expression: input.hiddenBy },
    { fieldName: 'highlightedBy', expression: input.highlightedBy },
  ]);
  return {
    Key: {
      webinarId: { S: input.webinarId },
      createdAt: { S: input.createdAt.toISOString() },
    },
    UpdateExpression,
    ExpressionAttributeValues,
  };
};

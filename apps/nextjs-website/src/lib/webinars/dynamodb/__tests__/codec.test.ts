import { WebinarQuestionUpdate } from '../../webinarQuestions';
import * as codec from '../codec';

const aWebinarQuestionUpdate = {
  webinarId: 'aWebinarId',
  createdAt: new Date(),
};

describe('makeDynamodbUpdateFromWebinarQuestionUpdate', () => {
  it('should return UpdateItemCommandInput given two update operation', () => {
    const update: WebinarQuestionUpdate = {
      ...aWebinarQuestionUpdate,
      hiddenBy: {
        operation: 'update',
        value: 'aNewHiddenValue',
      },
      highlightedBy: {
        operation: 'update',
        value: 'aNewHighlightedBy',
      },
    };
    const actual = codec.makeDynamodbUpdateFromWebinarQuestionUpdate(update);

    expect(actual).toStrictEqual({
      Key: {
        webinarId: { S: update.webinarId },
        createdAt: { S: update.createdAt.toISOString() },
      },
      UpdateExpression:
        'set hiddenBy = :hiddenBy, highlightedBy = :highlightedBy ',
      ExpressionAttributeValues: {
        ':hiddenBy': { S: 'aNewHiddenValue' },
        ':highlightedBy': { S: 'aNewHighlightedBy' },
      },
    });
  });

  it('should return UpdateItemCommandInput given a remove and update operation', () => {
    const update: WebinarQuestionUpdate = {
      ...aWebinarQuestionUpdate,
      hiddenBy: {
        operation: 'update',
        value: 'aNewHiddenValue',
      },
      highlightedBy: {
        operation: 'remove',
      },
    };
    const actual = codec.makeDynamodbUpdateFromWebinarQuestionUpdate(update);

    expect(actual).toStrictEqual({
      Key: {
        webinarId: { S: update.webinarId },
        createdAt: { S: update.createdAt.toISOString() },
      },
      UpdateExpression: 'set hiddenBy = :hiddenBy remove highlightedBy',
      ExpressionAttributeValues: {
        ':hiddenBy': { S: 'aNewHiddenValue' },
      },
    });
  });
});

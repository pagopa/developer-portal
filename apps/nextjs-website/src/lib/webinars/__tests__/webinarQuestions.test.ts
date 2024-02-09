import { mock } from 'jest-mock-extended';
import * as E from 'fp-ts/lib/Either';
import {
  WebinarEnv,
  insertWebinarQuestion,
  listWebinarQuestions,
} from '../webinarQuestions';
import { PutItemCommand, QueryCommand } from '@aws-sdk/client-dynamodb';
import { makeDynamodbItemFromWebinarQuestion } from '../dynamodb/codec';

const aWebinarQuestion = {
  webinarId: 'aWebinarId',
  question: 'aQuestion',
  createdAt: new Date(),
};
const aDynamoDBItem = makeDynamodbItemFromWebinarQuestion({
  ...aWebinarQuestion,
});

const makeTestWebinarEnv = () => {
  const nowDate = new Date(0);
  const dynamoDBClientMock = mock<WebinarEnv['dynamoDBClient']>();
  const nowDateMock = jest.fn();
  // default mock behaviour
  dynamoDBClientMock.send.mockImplementation((cmd) => {
    if (cmd instanceof PutItemCommand) return Promise.resolve({});
    else if (cmd instanceof QueryCommand)
      return Promise.resolve({ Items: [aDynamoDBItem] });
    // eslint-disable-next-line functional/no-promise-reject
    else return Promise.reject(new Error('Unsupported command'));
  });
  nowDateMock.mockImplementation(() => nowDate);
  const env = {
    dynamoDBClient: dynamoDBClientMock,
    nowDate: nowDateMock,
  };
  return { env, dynamoDBClientMock, nowDateMock, nowDate };
};

describe('webinarQuestions', () => {
  describe('insertWebinarQuestion', () => {
    it('should send dynamodb put command', async () => {
      const { env, dynamoDBClientMock, nowDateMock } = makeTestWebinarEnv();
      const actual = await insertWebinarQuestion(aWebinarQuestion)(env)();
      const expected = E.right(undefined);

      expect(dynamoDBClientMock.send).toBeCalledTimes(1);
      expect(nowDateMock).toBeCalledTimes(1);
      expect(actual).toStrictEqual(expected);
    });
    it('should return error if send returns an error', async () => {
      const error = new Error();
      const { env, dynamoDBClientMock, nowDateMock } = makeTestWebinarEnv();

      // override the mock to simulate a rejection
      // eslint-disable-next-line functional/no-promise-reject
      dynamoDBClientMock.send.mockImplementation(() => Promise.reject(error));

      const actual = await insertWebinarQuestion(aWebinarQuestion)(env)();
      const expected = E.left(error);

      expect(dynamoDBClientMock.send).toBeCalledTimes(1);
      expect(nowDateMock).toBeCalledTimes(1);
      expect(actual).toStrictEqual(expected);
    });
  });

  describe('listWebinarQuestion', () => {
    it('should return a list of webinar questions', async () => {
      const { env } = makeTestWebinarEnv();
      const { webinarId } = aWebinarQuestion;
      const actual = await listWebinarQuestions(webinarId)(env)();
      const expected = E.right([aWebinarQuestion]);

      expect(actual).toStrictEqual(expected);
    });

    it('should return an empty list if questions are undefined', async () => {
      const { env, dynamoDBClientMock } = makeTestWebinarEnv();
      const { webinarId } = aWebinarQuestion;
      dynamoDBClientMock.send.mockImplementation(() =>
        Promise.resolve({ Items: undefined })
      );
      const actual = await listWebinarQuestions(webinarId)(env)();
      const expected = E.right([]);

      expect(actual).toStrictEqual(expected);
    });
  });
});

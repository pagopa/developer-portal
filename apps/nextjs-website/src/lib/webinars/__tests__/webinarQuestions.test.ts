import { mock } from 'jest-mock-extended';
import * as E from 'fp-ts/lib/Either';
import {
  WebinarEnv,
  insertWebinarQuestion,
  listWebinarQuestion,
} from '../webinarQuestions';
import { PutItemCommand, QueryCommand } from '@aws-sdk/client-dynamodb';
import { makeDynamodbItemFromWebinarQuestion } from '../dynamodb/codec';

const aWebinarQuestion = {
  webinarId: 'aWebinarId',
  givenName: 'aGivenName',
  familyName: 'aFamilyName',
  question: 'aQuestion',
  createdAt: new Date(),
  expireAt: new Date('2024-01-22T11:36:31.000Z'),
};
const aDynamoDBItem = makeDynamodbItemFromWebinarQuestion({
  ...aWebinarQuestion,
});

const makeTestWebinarEnv = () => {
  const nowDate = new Date(0);
  const dynamodbClientMock = mock<WebinarEnv['dynamodbClient']>();
  const nowDateMock = jest.fn();
  // default mock behaviour
  dynamodbClientMock.send.mockImplementation((cmd) => {
    if (cmd instanceof PutItemCommand) return Promise.resolve({});
    else if (cmd instanceof QueryCommand)
      return Promise.resolve({ Items: [aDynamoDBItem] });
    // eslint-disable-next-line functional/no-promise-reject
    else return Promise.reject(new Error('Unsupported command'));
  });
  nowDateMock.mockImplementation(() => nowDate);
  nowDateMock;
  const env = {
    questionLifetimeInSeconds: 1000,
    dynamodbClient: dynamodbClientMock,
    nowDate: nowDateMock,
  };
  return { env, dynamodbClientMock, nowDateMock, nowDate };
};

describe('webinarQuestions', () => {
  describe('insertWebinarQuestion', () => {
    it('should send dynamodb put command', async () => {
      const { env, dynamodbClientMock, nowDateMock } = makeTestWebinarEnv();
      const actual = await insertWebinarQuestion(aWebinarQuestion)(env)();
      const expected = E.right(undefined);

      expect(dynamodbClientMock.send).toBeCalledTimes(1);
      expect(nowDateMock).toBeCalledTimes(1);
      expect(actual).toStrictEqual(expected);
    });
    it('should return error if send returns an error', async () => {
      const error = new Error();
      const { env, dynamodbClientMock, nowDateMock } = makeTestWebinarEnv();

      // override the mock to simulate a rejection
      // eslint-disable-next-line functional/no-promise-reject
      dynamodbClientMock.send.mockImplementation(() => Promise.reject(error));

      const actual = await insertWebinarQuestion(aWebinarQuestion)(env)();
      const expected = E.left(error);

      expect(dynamodbClientMock.send).toBeCalledTimes(1);
      expect(nowDateMock).toBeCalledTimes(1);
      expect(actual).toStrictEqual(expected);
    });
  });

  describe('listWebinarQuestion', () => {
    it('should return a list of webinar questions', async () => {
      const { env } = makeTestWebinarEnv();
      const { webinarId } = aWebinarQuestion;
      const actual = await listWebinarQuestion(webinarId)(env)();
      const expected = E.right([aWebinarQuestion]);

      expect(actual).toStrictEqual(expected);
    });
  });
});

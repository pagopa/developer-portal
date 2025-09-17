import { mock } from 'jest-mock-extended';
import * as E from 'fp-ts/lib/Either';
import {
  WebinarEnv,
  WebinarSubscription,
  deleteWebinarSubscription,
  insertWebinarSubscription,
  listUserWebinarSubscriptions,
} from '../webinarSubscriptions';
import {
  DeleteItemCommand,
  PutItemCommand,
  QueryCommand,
} from '@aws-sdk/client-dynamodb';
import { makeDynamodbItemFromWebinarSubscription } from '../dynamodb/codec';

const aWebinarSubscription: WebinarSubscription = {
  username: 'aUsername@mail.com',
  webinarId: 'a-webinar-id',
  createdAt: new Date(0),
};
const aInsertWebinarSubscription: WebinarSubscription = {
  username: aWebinarSubscription.username,
  webinarId: aWebinarSubscription.webinarId,
  createdAt: aWebinarSubscription.createdAt,
};
const aDynamoDBItem = makeDynamodbItemFromWebinarSubscription({
  ...aWebinarSubscription,
});

const makeTestWebinarEnv = () => {
  const nowDate = new Date(0);
  const dynamoDBClientMock = mock<WebinarEnv['dynamoDBClient']>();
  const nowDateMock = jest.fn();
  // default mock behaviour
  dynamoDBClientMock.send.mockImplementation(async (cmd) => {
    if (cmd instanceof PutItemCommand) return {};
    else if (cmd instanceof DeleteItemCommand) return {};
    else if (cmd instanceof QueryCommand) return { Items: [aDynamoDBItem] };
    else throw new Error('Unsupported command');
  });
  nowDateMock.mockImplementation(() => nowDate);
  const env = {
    dynamoDBClient: dynamoDBClientMock,
    nowDate: nowDateMock,
  };
  return { env, dynamoDBClientMock };
};

describe('webinarSubscriptions', () => {
  describe('insertWebinarSubscription', () => {
    it('should send dynamodb put command', async () => {
      const { env, dynamoDBClientMock } = makeTestWebinarEnv();
      const actual = await insertWebinarSubscription(
        aInsertWebinarSubscription.webinarId,
        aInsertWebinarSubscription.username,
      )(env)();
      const expected = E.right(undefined);

      expect(dynamoDBClientMock.send).toBeCalledTimes(1);
      expect(actual).toStrictEqual(expected);
    });
    it('should return error if send returns an error', async () => {
      const error = new Error();
      const { env, dynamoDBClientMock } = makeTestWebinarEnv();

      // override the mock to simulate a rejection

      dynamoDBClientMock.send.mockImplementation(() => Promise.reject(error));

      const actual = await insertWebinarSubscription(
        aInsertWebinarSubscription.webinarId,
        aInsertWebinarSubscription.username,
      )(env)();
      const expected = E.left(error);

      expect(dynamoDBClientMock.send).toBeCalledTimes(1);
      expect(actual).toStrictEqual(expected);
    });
  });

  describe('deleteWebinarSubscription', () => {
    it('should send dynamodb delete command', async () => {
      const { env, dynamoDBClientMock } = makeTestWebinarEnv();
      const actual = await deleteWebinarSubscription(
        aInsertWebinarSubscription.webinarId,
        aInsertWebinarSubscription.username,
      )(env)();
      const expected = E.right(undefined);

      expect(dynamoDBClientMock.send).toBeCalledTimes(1);
      expect(actual).toStrictEqual(expected);
    });

    it('should return error if send returns an error', async () => {
      const error = new Error();
      const { env, dynamoDBClientMock } = makeTestWebinarEnv();

      // override the mock to simulate a rejection

      dynamoDBClientMock.send.mockImplementation(() => Promise.reject(error));

      const actual = await deleteWebinarSubscription(
        aInsertWebinarSubscription.webinarId,
        aInsertWebinarSubscription.username,
      )(env)();
      const expected = E.left(error);

      expect(dynamoDBClientMock.send).toBeCalledTimes(1);
      expect(actual).toStrictEqual(expected);
    });
  });

  describe('listUserWebinarSubscriptions', () => {
    it('should return a list of webinar subscriptions', async () => {
      const { env } = makeTestWebinarEnv();
      const actual = await listUserWebinarSubscriptions(
        aWebinarSubscription.username,
      )(env)();
      const expected = E.right([aWebinarSubscription]);

      expect(actual).toStrictEqual(expected);
    });

    it('should return an empty list if subscriptions are undefined', async () => {
      const { env, dynamoDBClientMock } = makeTestWebinarEnv();
      dynamoDBClientMock.send.mockImplementation(() =>
        Promise.resolve({ Items: undefined }),
      );
      const actual = await listUserWebinarSubscriptions(
        aWebinarSubscription.username,
      )(env)();
      const expected = E.right([]);

      expect(actual).toStrictEqual(expected);
    });

    it('should return error if send returns an error', async () => {
      const error = new Error();
      const { env, dynamoDBClientMock } = makeTestWebinarEnv();

      // override the mock to simulate a rejection

      dynamoDBClientMock.send.mockImplementation(() => Promise.reject(error));

      const actual = await listUserWebinarSubscriptions(
        aInsertWebinarSubscription.username,
      )(env)();
      const expected = E.left(error);

      expect(dynamoDBClientMock.send).toBeCalledTimes(1);
      expect(actual).toStrictEqual(expected);
    });
  });
});

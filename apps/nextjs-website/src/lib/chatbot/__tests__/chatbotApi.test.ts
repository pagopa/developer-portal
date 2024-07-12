import { getQueries, postQuery } from '../chatbotApi';

const makeTestEnv = () => {
  const fetchMock = jest.fn();
  return {
    fetchMock,
    env: {
      config: {
        CHATBOT_HOST: 'chatbotHost',
      },
      fetch: fetchMock,
    },
  };
};

const postQueryResponses = {
  200: {
    sessionId: 'sessionId',
    queriedAt: '2024-02-08T11:12:02.142Z',
    query: 'query',
    answer: 'answer',
    createdAt: '2024-02-08T11:12:02.438Z',
  },
  404: {
    data: null,
    error: {
      status: 404,
      name: 'NotFoundError',
      message: 'Not Found',
      details: {},
    },
  },
  401: {
    data: null,
    error: {
      status: 401,
      name: 'UnauthorizedError',
      message: 'Missing or invalid credentials',
      details: {},
    },
  },
};

const getQueriesResponses = {
  200: [
    {
      sessionId: 'sessionId',
      queriedAt: '2024-02-08T11:12:02.142Z',
      question: 'question',
      answer: 'answer',
      createdAt: '2024-02-08T11:12:02.438Z',
    },
  ],
  404: {
    data: null,
    error: {
      status: 404,
      name: 'NotFoundError',
      message: 'Not Found',
      details: {},
    },
  },
  401: {
    data: null,
    error: {
      status: 401,
      name: 'UnauthorizedError',
      message: 'Missing or invalid credentials',
      details: {},
    },
  },
};

const badResponse = {
  200: {
    sessionId: 1234,
    queriedAt: '2024-02-08T11:12:02.142Z',
    question: 'question',
    answer: 'answer',
    createdAt: '2024-02-08T11:12:02.438Z',
  },
};

describe('chatbotApi', () => {
  it('chatbotApi::postQuery should return a query response given a 200 response', async () => {
    const { env, fetchMock } = makeTestEnv();
    fetchMock.mockResolvedValueOnce({
      status: 200,
      statusText: 'OK',
      json: () => Promise.resolve(postQueryResponses[200]),
    });
    const actual = postQuery({
      sessionId: 'aSessionId',
      queriedAt: 'aQueriedAt',
      question: 'aQuery',
    })(env);
    const expected = {
      answer: 'answer',
      createdAt: '2024-02-08T11:12:02.438Z',
    };
    expect(await actual).toStrictEqual(expected);
  });
  it('chatbotApi::getQueries should return the queries of a session given a 200 response', async () => {
    const { env, fetchMock } = makeTestEnv();
    fetchMock.mockResolvedValueOnce({
      status: 200,
      statusText: 'Not Found',
      json: () => Promise.resolve(getQueriesResponses[200]),
    });
    const actual = getQueries('sessionId')(env);
    const expected = [
      {
        sessionId: 'sessionId',
        queriedAt: '2024-02-08T11:12:02.142Z',
        question: 'query',
        answer: 'answer',
        createdAt: '2024-02-08T11:12:02.438Z',
      },
    ];
    await expect(actual).rejects.toStrictEqual(expected);
  });
  it('chatbotApi::postQuery should return error given a 401 response', async () => {
    const { env, fetchMock } = makeTestEnv();
    fetchMock.mockResolvedValueOnce({
      status: 401,
      statusText: 'Unauthorized',
      json: () => Promise.resolve(postQueryResponses[401]),
    });
    const actual = postQuery({
      sessionId: 'aSessionId',
      queriedAt: 'aQueriedAt',
      question: 'aQuery',
    })(env);
    const expected = new Error('401 - Unauthorized');
    await expect(actual).rejects.toStrictEqual(expected);
  });
  it('chatbotApi::getQueries should return error given a 404 response', async () => {
    const { env, fetchMock } = makeTestEnv();
    fetchMock.mockResolvedValueOnce({
      status: 404,
      statusText: 'Not Found',
      json: () => Promise.resolve(postQueryResponses[404]),
    });
    const actual = getQueries('wrongSessionId')(env);
    const expected = new Error('404 - Not Found');
    await expect(actual).rejects.toStrictEqual(expected);
  });
  it('chatbotApi::postQuery should return error given a reject', async () => {
    const { env, fetchMock } = makeTestEnv();
    fetchMock.mockRejectedValueOnce({});
    const actual = postQuery({
      sessionId: 'aWrongSessionId',
      queriedAt: 'aQueriedAt',
      question: 'aQuery',
    })(env);
    const expected = new Error('[object Object]');
    await expect(actual).rejects.toStrictEqual(expected);
  });
  it('chatbotAp::postQuery should return error given a decode error', async () => {
    const { env, fetchMock } = makeTestEnv();
    fetchMock.mockResolvedValueOnce({
      status: 200,
      statusText: 'OK',
      json: () => Promise.resolve(badResponse[200]),
    });
    const actual = postQuery({
      sessionId: 'aSessionId',
      queriedAt: 'aQueriedAt',
      question: 'aQuery',
    })(env);
    const expected = new Error(
      `Invalid value 1 supplied to '/sessionId', expected type string`
    );
    await expect(actual).rejects.toStrictEqual(expected);
  });
});

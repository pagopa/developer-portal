import { getQueries, postQuery } from '@/lib/chatbot/chatbotQueries';

const makeTestEnv = () => {
  const fetchMock = jest.fn();
  return {
    fetchMock,
    env: {
      config: {
        CHATBOT_HOST: 'chatbotHost',
      },
      getAuthToken: async () => 'authToken',
      fetch: fetchMock,
    },
  };
};

const postQueryResponses = {
  200: {
    id: 'queryId',
    sessionId: 'sessionId',
    queriedAt: '2024-02-08T11:12:02.142Z',
    question: 'question',
    answer: 'answer',
    history: [
      {
        id: '1',
        question: 'question',
        answer: 'answer',
      },
      {
        id: '2',
        question: 'question',
        answer: 'answer',
      },
    ],
    createdAt: '2024-02-08T11:12:02.438Z',
    badAnswer: false,
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
      id: 'queryId',
      sessionId: 'sessionId',
      queriedAt: '2024-02-08T11:12:02.142Z',
      question: 'question',
      answer: 'answer',
      createdAt: '2024-02-08T11:12:02.438Z',
      badAnswer: false,
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

describe('chatbotApi', () => {
  it('chatbotApi::postQuery should return a query response given a 200 response', async () => {
    const { env, fetchMock } = makeTestEnv();
    fetchMock.mockResolvedValueOnce({
      status: 200,
      statusText: 'OK',
      json: () => Promise.resolve(postQueryResponses[200]),
    });
    const actual = postQuery({
      queriedAt: 'aQueriedAt',
      question: 'aQuery',
    })(env);
    const expected = {
      id: 'queryId',
      sessionId: 'sessionId',
      queriedAt: '2024-02-08T11:12:02.142Z',
      question: 'question',
      answer: 'answer',
      createdAt: '2024-02-08T11:12:02.438Z',
      badAnswer: false,
      history: [
        {
          id: '1',
          question: 'question',
          answer: 'answer',
        },
        {
          id: '2',
          question: 'question',
          answer: 'answer',
        },
      ],
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
        id: 'queryId',
        sessionId: 'sessionId',
        queriedAt: '2024-02-08T11:12:02.142Z',
        question: 'question',
        answer: 'answer',
        createdAt: '2024-02-08T11:12:02.438Z',
        badAnswer: false,
      },
    ];
    expect(await actual).toStrictEqual(expected);
  });
  it('chatbotApi::postQuery should return error given a 401 response', async () => {
    const { env, fetchMock } = makeTestEnv();
    fetchMock.mockResolvedValueOnce({
      status: 401,
      statusText: 'Unauthorized',
      json: () => Promise.resolve(postQueryResponses[401]),
    });
    const actual = postQuery({
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
      queriedAt: 'aQueriedAt',
      question: 'aQuery',
    })(env);
    const expected = {};
    await expect(actual).rejects.toStrictEqual(expected);
  });
});

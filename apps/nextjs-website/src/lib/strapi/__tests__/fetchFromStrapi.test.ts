import * as t from 'io-ts';
import {
  deprecatedFetchFromStrapi,
  fetchFromStrapi,
} from '@/lib/strapi/fetchFromStrapi';

const makeTestEnv = () => {
  const fetchMock = jest.fn();
  return {
    fetchMock,
    env: {
      config: {
        STRAPI_ENDPOINT: 'aStrapiEndpoint',
        STRAPI_API_TOKEN: 'aStrapiApiToken',
      },
      fetchFun: fetchMock,
    },
  };
};

const strapiResponses = {
  200: {
    data: {
      id: 1,
      attributes: {
        createdAt: '2024-02-08T11:12:02.142Z',
        updatedAt: '2024-02-08T11:12:21.438Z',
        publishedAt: '2024-02-08T11:12:21.436Z',
      },
    },
    meta: {},
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

const codec = t.strict({
  data: t.strict({
    id: t.number,
  }),
});
// This codec is used to test cases when the decode function fails
const badCodec = t.strict({
  data: t.strict({
    id: t.string,
  }),
});

type StrapiSuccessResponse = {
  readonly data: {
    readonly id: number;
    readonly attributes: {
      readonly createdAt: string;
      readonly updatedAt: string;
      readonly publishedAt: string;
    };
  };
  readonly meta: NonNullable<unknown>;
};

type StrapiErrorResponse = {
  readonly data: null;
  readonly error: {
    readonly status: number;
    readonly name: string;
    readonly message: string;
    readonly details: NonNullable<unknown>;
  };
};

type CustomResponse = {
  readonly someField: string;
  readonly anotherField: number;
};

describe('fetchFromStrapi', () => {
  it('should return strapi response given a 200 response', async () => {
    const { env, fetchMock } = makeTestEnv();
    fetchMock.mockResolvedValueOnce({
      status: 200,
      statusText: 'OK',
      json: () => Promise.resolve(strapiResponses[200]),
    });
    const actual = deprecatedFetchFromStrapi('aPath', 'aPopulate', codec)(env);
    const expected = { data: { id: 1 } };
    expect(await actual).toStrictEqual(expected);
  });
  it('should return error given a 401 response', async () => {
    const { env, fetchMock } = makeTestEnv();
    fetchMock.mockResolvedValueOnce({
      status: 401,
      statusText: 'Unauthorized',
      json: () => Promise.resolve(strapiResponses[401]),
    });
    const actual = deprecatedFetchFromStrapi('aPath', 'aPopulate', codec)(env);
    const expected = new Error('401 - Unauthorized');
    await expect(actual).rejects.toStrictEqual(expected);
  });
  it('should return error given a 404 response', async () => {
    const { env, fetchMock } = makeTestEnv();
    fetchMock.mockResolvedValueOnce({
      status: 404,
      statusText: 'Not Found',
      json: () => Promise.resolve(strapiResponses[404]),
    });
    const actual = deprecatedFetchFromStrapi('aPath', 'aPopulate', codec)(env);
    const expected = new Error('404 - Not Found');
    await expect(actual).rejects.toStrictEqual(expected);
  });
  it('should return error given a reject', async () => {
    const { env, fetchMock } = makeTestEnv();
    fetchMock.mockRejectedValueOnce({});
    const actual = deprecatedFetchFromStrapi('aPath', 'aPopulate', codec)(env);
    const expected = new Error('[object Object]');
    await expect(actual).rejects.toStrictEqual(expected);
  });
  it('should return error given a decode error', async () => {
    const { env, fetchMock } = makeTestEnv();
    fetchMock.mockResolvedValueOnce({
      status: 200,
      statusText: 'OK',
      json: () => Promise.resolve(strapiResponses[200]),
    });
    const actual = deprecatedFetchFromStrapi(
      'aPath',
      'aPopulate',
      badCodec
    )(env);
    const expected = new Error(
      `Invalid value 1 supplied to '/data/id', expected type string`
    );
    await expect(actual).rejects.toStrictEqual(expected);
  });

  describe('fetchFromStrapi function', () => {
    it('should return strapi response given a 200 response', async () => {
      const { env, fetchMock } = makeTestEnv();
      fetchMock.mockResolvedValueOnce({
        status: 200,
        statusText: 'OK',
        json: () => Promise.resolve(strapiResponses[200]),
      });
      const actual = fetchFromStrapi<StrapiSuccessResponse>(
        'aPath',
        'aPopulate'
      )(env);
      const expected = strapiResponses[200];
      expect(await actual).toStrictEqual(expected);
    });

    it('should return error given a 401 response', async () => {
      const { env, fetchMock } = makeTestEnv();
      fetchMock.mockResolvedValueOnce({
        status: 401,
        statusText: 'Unauthorized',
        json: () => Promise.resolve(strapiResponses[401]),
      });
      const actual = fetchFromStrapi<StrapiErrorResponse>(
        'aPath',
        'aPopulate'
      )(env);
      const expected = new Error('401 - Unauthorized');
      await expect(actual).rejects.toStrictEqual(expected);
    });

    it('should return error given a 404 response', async () => {
      const { env, fetchMock } = makeTestEnv();
      fetchMock.mockResolvedValueOnce({
        status: 404,
        statusText: 'Not Found',
        json: () => Promise.resolve(strapiResponses[404]),
      });
      const actual = fetchFromStrapi<StrapiErrorResponse>(
        'aPath',
        'aPopulate'
      )(env);
      const expected = new Error('404 - Not Found');
      await expect(actual).rejects.toStrictEqual(expected);
    });

    it('should return error given a reject', async () => {
      const { env, fetchMock } = makeTestEnv();
      fetchMock.mockRejectedValueOnce({});
      const actual = fetchFromStrapi<StrapiSuccessResponse>(
        'aPath',
        'aPopulate'
      )(env);
      const expected = new Error('[object Object]');
      await expect(actual).rejects.toStrictEqual(expected);
    });

    it('should return a CustomResponse object with field undefined', async () => {
      const { env, fetchMock } = makeTestEnv();
      fetchMock.mockResolvedValueOnce({
        status: 200,
        statusText: 'OK',
        json: () => Promise.resolve(strapiResponses[200]),
      });
      const actual = await fetchFromStrapi<CustomResponse>(
        'aPath',
        'aPopulate'
      )(env);
      expect(actual['someField']).toBeUndefined();
      expect(actual['anotherField']).toBeUndefined();
    });
  });
});

import Redis from 'ioredis';

// eslint-disable-next-line functional/no-let
let redisClient: Redis | null = null;

export const getRedisClient = () => {
  if (!redisClient) {
    // eslint-disable-next-line functional/no-expression-statements
    redisClient = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379'),
      password: process.env.REDIS_PASSWORD || '',
      retryStrategy: (times) => Math.min(times * 50, 2000),
    });
  }
  return redisClient;
};

export const getCacheKey = (prefix: string, ...args: readonly string[]) =>
  `cache:${prefix}:${args.join(':')}`;

export const withCache = async <T>(
  key: string,
  fetchFn: () => Promise<T>,
  ttl: number = parseInt(process.env.REDIS_CACHE_TTL || '300')
): Promise<T> => {
  const redis = getRedisClient();

  // eslint-disable-next-line functional/no-try-statements
  try {
    // eslint-disable-next-line functional/no-expression-statements
    const cachedData = await redis.get(key);
    if (cachedData) {
      return JSON.parse(cachedData);
    }

    // If no cached data, fetch and cache
    const data = await fetchFn();
    // eslint-disable-next-line functional/no-expression-statements
    await redis.setex(key, ttl, JSON.stringify(data));
    return data;
  } catch (error) {
    // eslint-disable-next-line functional/no-expression-statements
    console.error('Redis cache error:', error);
    // eslint-disable-next-line functional/no-expression-statements
    return fetchFn();
  }
};

// In-memory cache store
interface CacheEntry<T> {
  readonly data: T;
  readonly expiry: number;
}

// Replace any with unknown for better type safety
const cacheStore = new Map<string, CacheEntry<unknown>>();

export const getCacheKey = (prefix: string, ...args: readonly string[]) =>
  `cache:${prefix}:${args.join(':')}`;

export const withCache = async <T>(
  key: string,
  fetchFn: () => Promise<T>,
  ttl: number = parseInt(process.env.REDIS_CACHE_TTL || '300')
): Promise<T> => {
  const now = Date.now();
  const cached = cacheStore.get(key);

  // Check if we have valid cached data
  if (cached && cached.expiry > now) {
    return cached.data as T;
  }

  // If no cached data or expired, fetch and cache
  // eslint-disable-next-line functional/no-try-statements
  try {
    const data = await fetchFn();
    // eslint-disable-next-line functional/no-expression-statements
    cacheStore.set(key, {
      data,
      expiry: now + ttl * 1000, // Convert TTL to milliseconds
    });
    return data;
  } catch (error) {
    // eslint-disable-next-line functional/no-expression-statements
    console.error('Cache error:', error);
    return fetchFn();
  }
};

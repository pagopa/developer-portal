// In-memory cache store
interface CacheEntry<T> {
  readonly data: T;
  readonly expiry: number;
}

const cacheStore = new Map<string, CacheEntry<unknown>>();

export const getCacheKey = (prefix: string, ...args: readonly string[]) =>
  `cache:${prefix}:${args.join(':')}`;

export const withCache = async <T>(
  key: string,
  fetchFn: () => Promise<T>,
  cache_expiry_in_seconds: number
): Promise<T> => {
  const now = Date.now();
  console.log('now', now);
  const cached = cacheStore.get(key);

  console.log('cached', cached);
  console.log('is cached?', cached && cached.expiry > now);
  // Check if we have valid cached data
  // if (cached && cached.expiry > now) {
  //   return cached.data as T;
  // }

  // If no cached data or expired, fetch and cache
  // eslint-disable-next-line functional/no-try-statements
  try {
    const data = await fetchFn();
    // eslint-disable-next-line functional/no-expression-statements
    cacheStore.set(key, {
      data,
      expiry: now + cache_expiry_in_seconds * 1000,
    });
    return data;
  } catch (error) {
    // eslint-disable-next-line functional/no-expression-statements
    console.error('Cache error:', error);
    return fetchFn();
  }
};

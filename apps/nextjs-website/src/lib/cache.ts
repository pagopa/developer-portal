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
  return fetchFn();
};

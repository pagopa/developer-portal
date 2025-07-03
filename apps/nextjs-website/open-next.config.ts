import type { OpenNextConfig } from '@opennextjs/aws/types/open-next';
const config = {
  default: {
    // override: {
    //   // This is necessary to enable lambda streaming, defaults to aws-lambda
    //   wrapper: 'aws-lambda-streaming',
    // },
  },
  dangerous: {
    // Enable the cache interception. Every request will go through the cache interceptor, if it is found in the cache,
    // it will be returned without going through NextServer. Not every feature is covered by the cache interceptor and
    // it should fallback to the NextServer if the cache is not found.
    enableCacheInterception: true,
  },
} satisfies OpenNextConfig;

export default config;

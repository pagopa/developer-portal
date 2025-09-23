import * as E from 'fp-ts/lib/Either';
import { StrapiConfig } from '@/lib/strapi/StrapiConfig';

export type BuildConfig = {
  readonly FETCH_FROM_STRAPI: boolean;
} & StrapiConfig;

export const makeBuildConfig = (
  env: Record<string, undefined | string>
): E.Either<string, BuildConfig> =>
  (env.FETCH_FROM_STRAPI &&
    env.STRAPI_ENDPOINT &&
    env.STRAPI_API_TOKEN &&
    E.right({
      FETCH_FROM_STRAPI: env.FETCH_FROM_STRAPI === 'true',
      STRAPI_ENDPOINT: env.STRAPI_ENDPOINT,
      STRAPI_API_TOKEN: env.STRAPI_API_TOKEN,
    } as BuildConfig)) ||
  E.left('Missing environment variables');

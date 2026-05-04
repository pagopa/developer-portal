import * as E from 'fp-ts/lib/Either';
import { StrapiConfig } from '@/lib/strapi/StrapiConfig';

export type BuildConfig = {
  readonly FETCH_FROM_STRAPI: boolean;
} & StrapiConfig;

export const makeBuildConfig = (
  env: Record<string, undefined | string>
): E.Either<string, BuildConfig> =>
  (env.FETCH_FROM_STRAPI &&
    env.STRAPIV4_ENDPOINT &&
    env.STRAPIV4_API_TOKEN &&
    E.right({
      FETCH_FROM_STRAPI: env.FETCH_FROM_STRAPI === 'true',
      STRAPI_ENDPOINT: env.STRAPIV4_ENDPOINT,
      STRAPI_API_TOKEN: env.STRAPIV4_API_TOKEN,
    })) ||
  E.left('Missing environment variables');

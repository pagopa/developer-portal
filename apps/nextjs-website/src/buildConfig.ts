import * as E from 'fp-ts/lib/Either';
import { StrapiConfig } from '@/lib/strapi/strapiConfig';

export type BuildConfig = StrapiConfig;

export const makeBuildConfig = (
  env: Record<string, undefined | string>
): E.Either<string, BuildConfig> =>
  (env.STRAPI_ENDPOINT &&
    env.STRAPI_API_TOKEN &&
    E.right({
      STRAPI_ENDPOINT: env.STRAPI_ENDPOINT,
      STRAPI_API_TOKEN: env.STRAPI_API_TOKEN,
    })) ||
  E.left('Missing environment variables');

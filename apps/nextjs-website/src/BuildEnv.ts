import { pipe } from 'fp-ts/lib/function';
import * as E from 'fp-ts/lib/Either';
import { BuildConfig, makeBuildConfig } from './config';
import { StrapiEnv } from './lib/strapi/fetchFromStrapi';

// This type represents the environment of build-time application. It contains
// configuration as well as other dependencies required during build phase by
// the application. In other words contains all runtime configuration and global
// functions that may be mockable
export type BuildEnv = {
  readonly config: BuildConfig;
} & StrapiEnv;

// given environment variables produce an BuildEnv
export const makeBuildEnv = (
  env: Record<string, undefined | string>
): E.Either<string, BuildEnv> =>
  pipe(
    makeBuildConfig(env),
    E.map((config) => ({
      config,
      strapiEndpoint: config.STRAPI_ENDPOINT,
      strapiApiToken: config.STRAPI_API_TOKEN,
      fetchFun: fetch,
    }))
  );

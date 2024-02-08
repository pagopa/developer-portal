import { pipe } from 'fp-ts/function';
import * as E from 'fp-ts/Either';
import { BuildConfig, makeBuildConfig } from '@/BuildConfig';
import { publicEnv } from '@/BrowserConfig';
import { StrapiEnv } from '@/lib/strapi/StapiEnv';

// BuildEnv
export type BuildEnv = {
  readonly config: BuildConfig;
} & StrapiEnv;

// given environment variables produce an BuildEnv
const makeBuildEnv = (config: BuildConfig): BuildEnv => ({
  config,
  fetchFun: fetch,
});

export const buildEnv = pipe(
  makeBuildConfig(publicEnv),
  E.map(makeBuildEnv),
  E.getOrElseW((errors) => {
    // eslint-disable-next-line functional/no-throw-statements
    throw errors;
  })
);

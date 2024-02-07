import { BuildConfig, makeBuildConfig } from './BuildConfig';
import { pipe } from 'fp-ts/function';
import { publicEnv } from '@/BrowserConfig';
import * as E from 'fp-ts/Either';

export type BuildEnv = {
  readonly config: BuildConfig;
};

// given environment variables produce an BuildEnv
const makeBuildEnv = (config: BuildConfig): BuildEnv => ({
  config,
});

export const buildEnv = pipe(
  makeBuildConfig(publicEnv),
  E.map(makeBuildEnv),
  E.getOrElseW((errors) => {
    // eslint-disable-next-line functional/no-throw-statements
    throw errors;
  })
);

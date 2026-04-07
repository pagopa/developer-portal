import { pipe } from 'fp-ts/lib/function';
import * as E from 'fp-ts/lib/Either';
import { makeBuildConfig } from '@/buildConfig';
import { makeBuildEnv } from '@/buildEnv';
import { secrets } from '@/config';

// a BuildEnv instance ready to be used
export const buildEnv = pipe(
  makeBuildConfig(Object.keys(secrets).length > 0 ? secrets : process.env),
  E.map(makeBuildEnv),
  E.getOrElseW((errors) => {
    // eslint-disable-next-line functional/no-throw-statements
    throw errors;
  })
);

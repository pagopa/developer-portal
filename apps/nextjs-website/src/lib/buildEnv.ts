import { pipe } from 'fp-ts/lib/function';
import * as E from 'fp-ts/lib/Either';
import { makeBuildConfig } from '@/buildConfig';
import { makeBuildEnv } from '@/buildEnv';
const secrets = process.env.secrets ? JSON.parse(process.env.secrets) : {};

export const buildEnv = pipe(
  makeBuildConfig(Object.keys(secrets).length > 0 ? secrets : process.env),
  E.map(makeBuildEnv),
  E.getOrElseW((errors) => {
    // eslint-disable-next-line functional/no-throw-statements
    throw errors;
  })
);

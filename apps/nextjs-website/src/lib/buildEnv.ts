import { pipe } from 'fp-ts/lib/function';
import * as E from 'fp-ts/lib/Either';
import { makeBuildConfig } from '@/buildConfig';
import { makeBuildEnv } from '@/buildEnv';
const secrets: Record<string, string | undefined> = process.env.secrets
  ? JSON.parse(process.env.secrets)
  : {};

// a BuildEnv instance ready to be used
export const buildEnv = pipe(
  makeBuildConfig({ ...process.env, ...secrets }),
  E.map(makeBuildEnv),
  E.getOrElseW((errors) => {
    // eslint-disable-next-line functional/no-throw-statements
    throw errors;
  })
);

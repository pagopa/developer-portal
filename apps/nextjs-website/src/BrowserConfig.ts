import * as t from 'io-ts';
import { pipe } from 'fp-ts/lib/function';
import * as E from 'fp-ts/lib/Either';
import * as PR from 'io-ts/lib/PathReporter';
import * as tt from 'io-ts-types';

const BrowserConfigCodec = t.type({
  NEXT_PUBLIC_COGNITO_REGION: t.string,
  NEXT_PUBLIC_COGNITO_USER_POOL_ID: t.string,
  NEXT_PUBLIC_COGNITO_IDENTITY_POOL_ID: t.string,
  NEXT_PUBLIC_WEBINAR_QUESTION_LIFETIME_IN_SECONDS: t.string.pipe(
    tt.NumberFromString
  ),
});

export type BrowserConfig = t.TypeOf<typeof BrowserConfigCodec>;

// TODO: Migrate all the above environment
// publicEnv exists to allow nextjs to correctly replace environments at build
// time, without this copy in some cases some NEXT_PUBLIC environments will be
// undefined
// https://nextjs.org/docs/pages/building-your-application/configuring/environment-variables#bundling-environment-variables-for-the-browser
export const publicEnv = {
  NEXT_PUBLIC_COGNITO_REGION: process.env.NEXT_PUBLIC_COGNITO_REGION,
  NEXT_PUBLIC_COGNITO_USER_POOL_ID:
    process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID,
  NEXT_PUBLIC_COGNITO_IDENTITY_POOL_ID:
    process.env.NEXT_PUBLIC_COGNITO_IDENTITY_POOL_ID,
  NEXT_PUBLIC_WEBINAR_QUESTION_LIFETIME_IN_SECONDS:
    process.env.NEXT_PUBLIC_WEBINAR_QUESTION_LIFETIME_IN_SECONDS,
};

export const makeBrowserConfig = (
  env: Record<string, undefined | string>
): E.Either<string, BrowserConfig> =>
  pipe(
    BrowserConfigCodec.decode(env),
    E.mapLeft((errors) => PR.failure(errors).join('\n'))
  );

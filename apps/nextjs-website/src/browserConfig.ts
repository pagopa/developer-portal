import * as E from 'fp-ts/lib/Either';
import { secrets } from './config';

export type BrowserConfig = {
  readonly NEXT_PUBLIC_COGNITO_REGION: string;
  readonly NEXT_PUBLIC_COGNITO_USER_POOL_ID: string;
  readonly NEXT_PUBLIC_COGNITO_IDENTITY_POOL_ID: string;
};

// TODO: Migrate all the above environment
// publicEnv exists to allow nextjs to correctly replace environments at build
// time, without this copy in some cases some NEXT_PUBLIC environments will be
// undefined
// https://nextjs.org/docs/pages/building-your-application/configuring/environment-variables#bundling-environment-variables-for-the-browser
export const publicEnv = {
  NEXT_PUBLIC_COGNITO_REGION: process.env.NEXT_PUBLIC_COGNITO_REGION,
  NEXT_PUBLIC_COGNITO_USER_POOL_ID:
    secrets.NEXT_PUBLIC_COGNITO_USER_POOL_ID ||
    process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID,
  NEXT_PUBLIC_COGNITO_IDENTITY_POOL_ID:
    secrets.NEXT_PUBLIC_COGNITO_IDENTITY_POOL_ID ||
    process.env.NEXT_PUBLIC_COGNITO_IDENTITY_POOL_ID,
};

export const makeBrowserConfig = (
  env: Record<string, undefined | string>
): E.Either<string, BrowserConfig> =>
  (env.NEXT_PUBLIC_COGNITO_REGION &&
    env.NEXT_PUBLIC_COGNITO_USER_POOL_ID &&
    env.NEXT_PUBLIC_COGNITO_IDENTITY_POOL_ID &&
    E.right({
      NEXT_PUBLIC_COGNITO_REGION: env.NEXT_PUBLIC_COGNITO_REGION,
      NEXT_PUBLIC_COGNITO_USER_POOL_ID: env.NEXT_PUBLIC_COGNITO_USER_POOL_ID,
      NEXT_PUBLIC_COGNITO_IDENTITY_POOL_ID:
        env.NEXT_PUBLIC_COGNITO_IDENTITY_POOL_ID,
    })) ||
  E.left('Missing environment variables');

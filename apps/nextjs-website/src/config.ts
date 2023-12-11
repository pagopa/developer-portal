import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import { pipe } from 'fp-ts/lib/function';
import * as E from 'fp-ts/lib/Either';
import * as PR from 'io-ts/lib/PathReporter';

// TODO: Add environment parser
export const docsPath = process.env.PATH_TO_GITBOOK_DOCS;
export const cookieDomainScript = process.env.NEXT_PUBLIC_COOKIE_DOMAIN_SCRIPT;
export const environment = process.env.ENVIRONMENT;
export const docsAssetsPath = '/gitbook/docs';
export const allowCrawler = process.env.ALLOW_CRAWLER === 'true';
export const isProduction = process.env.NEXT_PUBLIC_ENVIRONMENT === 'prod';

export const amplifyConfig = {
  Auth: {
    region: process.env.NEXT_PUBLIC_COGNITO_REGION,
    userPoolId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID,
    userPoolWebClientId:
      process.env.NEXT_PUBLIC_COGNITO_USER_POOL_WEB_CLIENT_ID,
  },
  authenticationFlowType: 'CUSTOM_AUTH',
};

export const profileMenuItems: readonly {
  readonly label: string;
  readonly href: string;
}[] = [
  { label: 'personalData.title', href: '/profile/personal-data' },
  { label: 'agreements.title', href: '/profile/agreements' },
];

export const snackbarAutoHideDurationMs = 10_000;

export const baseUrl = isProduction
  ? 'https://developer.pagopa.it'
  : 'https://dev.developer.pagopa.it';

export const defaultOgTagImage = `${baseUrl}/images/dev-portal-home.jpg`;
export const resetResendEmailAfterMs = 4_000;

export const defaultLanguage = { id: 'it', value: 'Italiano' };
export const languages = [defaultLanguage];

export const defaultLocale = 'it-IT';

export const dateOptions: Intl.DateTimeFormatOptions = {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  timeZone: 'Europe/Rome',
};

export const timeOptions: Intl.DateTimeFormatOptions = {
  hour: '2-digit',
  minute: '2-digit',
};

// TODO: Migrate all the above stuff
export const publicEnv = {
  NEXT_PUBLIC_COGNITO_REGION: process.env.NEXT_PUBLIC_COGNITO_REGION,
  NEXT_PUBLIC_COGNITO_USER_POOL_ID:
    process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID,
  NEXT_PUBLIC_COGNITO_IDENTITY_POOL_ID:
    process.env.NEXT_PUBLIC_COGNITO_IDENTITY_POOL_ID,
  NEXT_PUBLIC_WEBINAR_QUESTION_LIFETIME_IN_SECONDS:
    process.env.NEXT_PUBLIC_WEBINAR_QUESTION_LIFETIME_IN_SECONDS,
};

const ConfigCodec = t.type({
  NEXT_PUBLIC_COGNITO_REGION: t.string,
  NEXT_PUBLIC_COGNITO_USER_POOL_ID: t.string,
  NEXT_PUBLIC_COGNITO_IDENTITY_POOL_ID: t.string,
  NEXT_PUBLIC_WEBINAR_QUESTION_LIFETIME_IN_SECONDS: t.string.pipe(
    tt.NumberFromString
  ),
});

export type Config = t.TypeOf<typeof ConfigCodec>;

// parse config from environment variables
export const makeConfig = (
  env: Record<string, undefined | string>
): E.Either<string, Config> =>
  pipe(
    ConfigCodec.decode(env),
    E.mapLeft((errors) => PR.failure(errors).join('\n'))
  );

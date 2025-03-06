/* eslint-disable functional/no-expression-statements */
/**
This file is going to be removed after few refactoring phases.
The following environments are going to be moved in dedicated config files or environments.
See BrowserConfig.ts and BrowserEnv.ts as examples.

 @deprecated
 */
// TODO: Add environment parser

// TODO: remove this logs only to debug
console.log('process.env', process.env);
console.log('secret', process.env.secrets);

export const docsPath = process.env.PATH_TO_GITBOOK_DOCS;
export const secrets = process.env.secrets
  ? JSON.parse(process.env.secrets)
  : {};
export const s3DocsPath =
  secrets.S3_PATH_TO_GITBOOK_DOCS || process.env.S3_PATH_TO_GITBOOK_DOCS;
export const region = process.env.NEXT_PUBLIC_COGNITO_REGION || '';
export const credentials =
  process.env.S3_ACCESS_KEY_ID && process.env.S3_SECRET_ACCESS_KEY
    ? {
        accessKeyId: process.env.S3_ACCESS_KEY_ID,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
      }
    : undefined;
export const bucketName = process.env.S3_BUCKET_NAME || secrets.S3_BUCKET_NAME;
export const cookieDomainScript =
  secrets.NEXT_PUBLIC_COOKIE_DOMAIN_SCRIPT ||
  process.env.NEXT_PUBLIC_COOKIE_DOMAIN_SCRIPT;
export const environment = process.env.ENVIRONMENT;
export const docsAssetsPath = '/gitbook/docs';
export const docsS3AssetsPath = process.env.S3_PATH_TO_GITBOOK_DOCS_ASSETS;
export const allowCrawler = process.env.ALLOW_CRAWLER === 'true';
export const isProduction = process.env.NEXT_PUBLIC_ENVIRONMENT === 'prod';
export const isChatbotActive =
  process.env.NEXT_PUBLIC_CHATBOT_ACTIVE === 'true';
export const chatMaxHistoryMessages =
  parseInt(`${process.env.NEXT_PUBLIC_CHAT_MAX_HISTORY_MESSAGES}`) || 10;

export const amplifyConfig = {
  Auth: {
    region: process.env.NEXT_PUBLIC_COGNITO_REGION,
    userPoolId:
      secrets.NEXT_PUBLIC_COGNITO_USER_POOL_ID ||
      process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID,
    userPoolWebClientId:
      secrets.NEXT_PUBLIC_COGNITO_USER_POOL_WEB_CLIENT_ID ||
      process.env.NEXT_PUBLIC_COGNITO_USER_POOL_WEB_CLIENT_ID,
  },
  authenticationFlowType: 'CUSTOM_AUTH',
};
// TODO: remove this logs only to debug
console.log('amplifyConfig', amplifyConfig);

const defaultItems = [
  { label: 'personalData.title', href: '/profile/personal-data' },
  { label: 'agreements.title', href: '/profile/agreements' },
];

export const profileMenuItems: readonly {
  readonly label: string;
  readonly href: string;
}[] = isChatbotActive
  ? [
      ...defaultItems,
      { label: 'chatbot.title', href: '/profile/chatbot-history' },
    ]
  : defaultItems;

export const snackbarAutoHideDurationMs = 10_000;

export const baseUrl = isProduction
  ? 'https://developer.pagopa.it'
  : 'https://dev.developer.pagopa.it';

export const defaultOgTagImage = `${baseUrl}/images/dev-portal-home.jpg`;
export const resetResendEmailAfterMs = 4_000;
export const fetchWebinarsQuestionsIntervalMs = 1_000;
export const maxPastWebinarsInHome = 3;

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

export const websiteName = process.env.NEXT_PUBLIC_WEBSITE_NAME || 'DevPortal';

export const organizationInfo = {
  name: process.env.NEXT_PUBLIC_ORGANIZATION_NAME || 'PagoPA',
  url: baseUrl,
  logo:
    process.env.NEXT_PUBLIC_ORGANIZATION_LOGO ||
    'https://1603831084-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FvKmQOwMmwOgFq0L2Rf0Q%2Flogo%2FgCUQ6tWtEoMqS8uZcWOP%2FpagoPA.svg?alt=media&token=2405d6bd-94df-4129-8bcd-8dd0f52272d9',
  sameAs: (
    process.env.NEXT_PUBLIC_ORGANIZATION_SOCIAL_LINKS ||
    'https://x.com/PagoPA,https://www.instagram.com/pagopaspa/,https://www.linkedin.com/company/pagopa/,https://medium.com/pagopa-spa'
  ).split(','),
};

export const companyRoles = [
  'ente-pubblico',
  'partner-tecnologico',
  'psp',
  'gestore-di-pubblico-servizio',
  'azienda-privata',
  'altro',
];

export const signUpAdvantages = [
  'exclusive_contents',
  'product_updates',
  'api_keys',
  'support',
];

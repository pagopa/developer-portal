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

export const companyRoles = [
  'ente-pubblico',
  'partner-tecnologico',
  'psp',
  'gestore-di-pubblico-servizio',
  'azienda-privata',
  'altro',
];

export const snackbarAutoHideDurationMs = 10_000;

export const resetResendEmailAfterMs = 4_000;

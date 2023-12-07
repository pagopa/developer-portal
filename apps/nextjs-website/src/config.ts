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

export const baseUrl = isProduction
  ? 'https://developer.pagopa.it'
  : 'https://dev.developer.pagopa.it';

export const defaultOgTagImage = `${baseUrl}/images/dev-portal-home.jpg`;
export const snackbarAutoHideDurationMs = 10_000;
export const resetResendEmailAfterMs = 4_000;

// TODO: remove default values only for testing
export const webinarQuestionConfig = {
  url:
    process.env.NEXT_PUBLIC_WEBINAR_QUESTION_URL ||
    'https://script.google.com/macros/s/AKfycbyB3gzSdyH9941oSq3qTRJZIupMJ91baubWOY4rWWxNpG7JO2pv69LcItqkizGOIec/exec',
  resource: process.env.NEXT_PUBLIC_WEBINAR_QUESTION_SHEET_NAME || 'questions',
  token:
    process.env.NEXT_PUBLIC_WEBINAR_QUESTION_API_KEY || 'test_api_key_pago_pa',
};

import * as E from 'fp-ts/lib/Either';

export const browserSettings = (env: typeof publicEnv) => {
  const CHATBOT_HOST = env.NEXT_PUBLIC_CHATBOT_HOST;
  const cookieDomainScript = env.NEXT_PUBLIC_COOKIE_DOMAIN_SCRIPT;
  const useNewCookie = env.NEXT_PUBLIC_USE_NEW_COOKIE === 'true';
  const cookieScriptUrl = env.NEXT_PUBLIC_COOKIE_SCRIPT_URL;
  const cookieCategory = env.NEXT_PUBLIC_COOKIE_CATEGORY;
  const matomoScriptSrc =
    env.NEXT_PUBLIC_MATOMO_SCRIPT_SRC ||
    'https://cdn.matomo.cloud/pagopa.matomo.cloud/container_cT0RWuHZ.js';
  const amazonIvsVersion = env.NEXT_PUBLIC_AMAZON_IVS_VERSION || '1.45.0';
  const isProduction = env.NEXT_PUBLIC_ENVIRONMENT === 'prod';
  const isChatbotActive = env.NEXT_PUBLIC_CHATBOT_ACTIVE === 'true';
  const isFeedbackFormEnabled =
    env.NEXT_PUBLIC_FEEDBACK_FORM_ENABLED === 'true';
  const chatMaxHistoryMessages =
    parseInt(`${env.NEXT_PUBLIC_CHAT_MAX_HISTORY_MESSAGES}`) || 10;
  // Array that defines the header level for which to show component in the in-page menu
  const headingLevelsToShowInMenu = [2, 3];
  const isWebinarHeartbeatEnabled =
    env.NEXT_PUBLIC_WEBINAR_HEARTBEAT_ENABLED === 'true';
  const webinarHeartbeatIntervalInSeconds =
    parseInt(env.NEXT_PUBLIC_WEBINAR_HEARTBEAT_INTERVAL_IN_SECONDS || '60') ||
    60;
  const amplifyConfig = {
    Auth: {
      region: env.NEXT_PUBLIC_COGNITO_REGION,
      userPoolId: env.NEXT_PUBLIC_COGNITO_USER_POOL_ID,
      userPoolWebClientId: env.NEXT_PUBLIC_COGNITO_USER_POOL_WEB_CLIENT_ID,
    },
    authenticationFlowType: 'CUSTOM_AUTH',
  };
  const defaultItems = [
    { label: 'personalData.title', href: '/profile/personal-data' },
    { label: 'agreements.title', href: '/profile/agreements' },
  ];
  const profileMenuItems: readonly {
    readonly label: string;
    readonly href: string;
  }[] = isChatbotActive
    ? [
        ...defaultItems,
        { label: 'chatbot.title', href: '/profile/chatbot-history' },
        ...(isWebinarHeartbeatEnabled
          ? [
              {
                label: 'certificateList.title',
                href: '/profile/certificate-list',
              },
            ]
          : []),
      ]
    : defaultItems;
  const snackbarAutoHideDurationMs = 10_000;
  const baseUrl =
    env.NEXT_PUBLIC_WEBSITE_BASE_URL || 'https://developer.pagopa.it';
  const defaultOgTagImage = `${baseUrl}/images/dev-portal-home.jpg`;
  const resetResendEmailAfterMs = 4_000;
  const fetchWebinarsQuestionsIntervalMs = 1_000;
  const maxPastWebinarsInHome = 3;
  const defaultLocale = 'it-IT';
  const dateOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'Europe/Rome',
  };
  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
  };
  const websiteName = env.NEXT_PUBLIC_WEBSITE_NAME || 'DevPortal';
  const organizationInfo = {
    name: env.NEXT_PUBLIC_ORGANIZATION_NAME || 'PagoPA',
    url: baseUrl,
    logo:
      env.NEXT_PUBLIC_ORGANIZATION_LOGO ||
      'https://1603831084-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FvKmQOwMmwOgFq0L2Rf0Q%2Flogo%2FgCUQ6tWtEoMqS8uZcWOP%2FpagoPA.svg?alt=media&token=2405d6bd-94df-4129-8bcd-8dd0f52272d9',
    sameAs: (
      env.NEXT_PUBLIC_ORGANIZATION_SOCIAL_LINKS ||
      'https://x.com/PagoPA,https://www.instagram.com/pagopaspa/,https://www.linkedin.com/company/pagopa/,https://medium.com/pagopa-spa'
    ).split(','),
  };
  const companyRoles = [
    'ente-pubblico',
    'partner-tecnologico',
    'psp',
    'gestore-di-pubblico-servizio',
    'azienda-privata',
    'altro',
  ];
  const signUpAdvantages = [
    'exclusive_contents',
    'product_updates',
    'api_keys',
    'support',
  ];
  const SITE_HEADER_HEIGHT = 48;
  const PRODUCT_HEADER_HEIGHT = 77;
  const webinarDateOptions = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  } as const;
  const longDateOptions = {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  } as const;
  const timeSlotDateOptions = {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  } as const;
  const timeSlotTimeOptions = {
    hour: 'numeric',
    minute: 'numeric',
  } as const;
  const chatTimeOptions = {
    timeStyle: 'short',
    hourCycle: 'h23',
  } as const;
  const chatbotListDateOptions = {
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
  } as const;
  const chatbotHeaderDateOptions = {
    month: 'long',
    year: 'numeric',
  } as const;
  const authCookieValidityInDays = parseInt(
    env.NEXT_PUBLIC_AUTH_COOKIE_VALIDITY_IN_DAYS || '60'
  );
  const loggedInCookieName = 'isLoggedIn';
  const docsAssetsPath = '/gitbook/docs';
  return {
    CHATBOT_HOST,
    cookieDomainScript,
    useNewCookie,
    cookieScriptUrl,
    cookieCategory,
    matomoScriptSrc,
    amazonIvsVersion,
    isProduction,
    isChatbotActive,
    isFeedbackFormEnabled,
    chatMaxHistoryMessages,
    headingLevelsToShowInMenu,
    isWebinarHeartbeatEnabled,
    webinarHeartbeatIntervalInSeconds,
    amplifyConfig,
    profileMenuItems,
    snackbarAutoHideDurationMs,
    baseUrl,
    defaultOgTagImage,
    resetResendEmailAfterMs,
    fetchWebinarsQuestionsIntervalMs,
    maxPastWebinarsInHome,
    defaultLocale,
    dateOptions,
    timeOptions,
    websiteName,
    organizationInfo,
    companyRoles,
    signUpAdvantages,
    SITE_HEADER_HEIGHT,
    PRODUCT_HEADER_HEIGHT,
    webinarDateOptions,
    longDateOptions,
    timeSlotDateOptions,
    timeSlotTimeOptions,
    chatTimeOptions,
    chatbotListDateOptions,
    chatbotHeaderDateOptions,
    authCookieValidityInDays,
    loggedInCookieName,
    docsAssetsPath,
  };
};

export type BrowserConfig = ReturnType<typeof browserSettings> & {
  readonly NEXT_PUBLIC_COGNITO_REGION: string;
  readonly NEXT_PUBLIC_COGNITO_USER_POOL_ID: string;
  readonly NEXT_PUBLIC_COGNITO_IDENTITY_POOL_ID: string;
  readonly NEXT_PUBLIC_VIDEO_API_BASE_URL: string;
};

// TODO: Migrate all the above environment
// publicEnv exists to allow nextjs to correctly replace environments at build
// time, without this copy in some cases some NEXT_PUBLIC environments will be
// undefined
// https://nextjs.org/docs/pages/building-your-application/configuring/environment-variables#bundling-environment-variables-for-the-browser
export const publicEnv = {
  NEXT_PUBLIC_CHATBOT_HOST: process.env.NEXT_PUBLIC_CHATBOT_HOST,
  NEXT_PUBLIC_AMAZON_IVS_VERSION: process.env.NEXT_PUBLIC_AMAZON_IVS_VERSION,
  NEXT_PUBLIC_AUTH_COOKIE_VALIDITY_IN_DAYS:
    process.env.NEXT_PUBLIC_AUTH_COOKIE_VALIDITY_IN_DAYS,
  NEXT_PUBLIC_CHATBOT_ACTIVE: process.env.NEXT_PUBLIC_CHATBOT_ACTIVE,
  NEXT_PUBLIC_CHAT_MAX_HISTORY_MESSAGES:
    process.env.NEXT_PUBLIC_CHAT_MAX_HISTORY_MESSAGES,
  NEXT_PUBLIC_COGNITO_USER_POOL_WEB_CLIENT_ID:
    process.env.NEXT_PUBLIC_COGNITO_USER_POOL_WEB_CLIENT_ID,
  NEXT_PUBLIC_COOKIE_CATEGORY: process.env.NEXT_PUBLIC_COOKIE_CATEGORY,
  NEXT_PUBLIC_COOKIE_DOMAIN_SCRIPT:
    process.env.NEXT_PUBLIC_COOKIE_DOMAIN_SCRIPT,
  NEXT_PUBLIC_COOKIE_SCRIPT_URL: process.env.NEXT_PUBLIC_COOKIE_SCRIPT_URL,
  NEXT_PUBLIC_ENVIRONMENT: process.env.NEXT_PUBLIC_ENVIRONMENT,
  NEXT_PUBLIC_FEEDBACK_FORM_ENABLED:
    process.env.NEXT_PUBLIC_FEEDBACK_FORM_ENABLED,
  NEXT_PUBLIC_MATOMO_SCRIPT_SRC: process.env.NEXT_PUBLIC_MATOMO_SCRIPT_SRC,
  NEXT_PUBLIC_ORGANIZATION_LOGO: process.env.NEXT_PUBLIC_ORGANIZATION_LOGO,
  NEXT_PUBLIC_ORGANIZATION_NAME: process.env.NEXT_PUBLIC_ORGANIZATION_NAME,
  NEXT_PUBLIC_ORGANIZATION_SOCIAL_LINKS:
    process.env.NEXT_PUBLIC_ORGANIZATION_SOCIAL_LINKS,
  NEXT_PUBLIC_USE_NEW_COOKIE: process.env.NEXT_PUBLIC_USE_NEW_COOKIE,
  NEXT_PUBLIC_WEBINAR_HEARTBEAT_ENABLED:
    process.env.NEXT_PUBLIC_WEBINAR_HEARTBEAT_ENABLED,
  NEXT_PUBLIC_WEBINAR_HEARTBEAT_INTERVAL_IN_SECONDS:
    process.env.NEXT_PUBLIC_WEBINAR_HEARTBEAT_INTERVAL_IN_SECONDS,
  NEXT_PUBLIC_WEBSITE_BASE_URL: process.env.NEXT_PUBLIC_WEBSITE_BASE_URL,
  NEXT_PUBLIC_WEBSITE_NAME: process.env.NEXT_PUBLIC_WEBSITE_NAME,

  NEXT_PUBLIC_COGNITO_REGION: process.env.NEXT_PUBLIC_COGNITO_REGION,
  NEXT_PUBLIC_COGNITO_USER_POOL_ID:
    process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID,
  NEXT_PUBLIC_COGNITO_IDENTITY_POOL_ID:
    process.env.NEXT_PUBLIC_COGNITO_IDENTITY_POOL_ID,
  NEXT_PUBLIC_VIDEO_API_BASE_URL: process.env.NEXT_PUBLIC_VIDEO_API_BASE_URL,
};

export const makeBrowserConfig = (
  env: Record<string, undefined | string>
): E.Either<string, BrowserConfig> =>
  (env.NEXT_PUBLIC_COGNITO_REGION &&
    env.NEXT_PUBLIC_COGNITO_USER_POOL_ID &&
    env.NEXT_PUBLIC_COGNITO_IDENTITY_POOL_ID &&
    env.NEXT_PUBLIC_VIDEO_API_BASE_URL &&
    E.right({
      NEXT_PUBLIC_COGNITO_REGION: env.NEXT_PUBLIC_COGNITO_REGION,
      NEXT_PUBLIC_COGNITO_USER_POOL_ID: env.NEXT_PUBLIC_COGNITO_USER_POOL_ID,
      NEXT_PUBLIC_COGNITO_IDENTITY_POOL_ID:
        env.NEXT_PUBLIC_COGNITO_IDENTITY_POOL_ID,
      NEXT_PUBLIC_VIDEO_API_BASE_URL: env.NEXT_PUBLIC_VIDEO_API_BASE_URL,
      ...browserSettings({ ...publicEnv, ...env }),
    })) ||
  E.left('Missing environment variables');

export const browserEnv = { config: browserSettings(publicEnv) };

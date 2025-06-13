// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "nextjs-website",
      removal: input?.stage === "production" ? "retain" : "remove",
      protect: ["production"].includes(input?.stage),
      home: "aws",
      environment: {
        S3_PATH_TO_GITBOOK_DOCS: process.env.S3_PATH_TO_GITBOOK_DOCS,
        PATH_TO_GITBOOK_DOCS: process.env.PATH_TO_GITBOOK_DOCS,
        S3_PATH_TO_GITBOOK_DOCS_ASSETS: process.env.S3_PATH_TO_GITBOOK_DOCS_ASSETS,
        COOKIE_DOMAIN_SCRIPT: process.env.COOKIE_DOMAIN_SCRIPT,
        ALLOW_CRAWLER: process.env.ALLOW_CRAWLER,
        NEXT_PUBLIC_COGNITO_USER_POOL_WEB_CLIENT_ID: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_WEB_CLIENT_ID,
        NEXT_PUBLIC_COGNITO_REGION: process.env.NEXT_PUBLIC_COGNITO_REGION,
        NEXT_PUBLIC_COGNITO_USER_POOL_ID: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID,
        NEXT_PUBLIC_ENVIRONMENT: process.env.NEXT_PUBLIC_ENVIRONMENT,
        NEXT_PUBLIC_COOKIE_DOMAIN_SCRIPT: process.env.NEXT_PUBLIC_COOKIE_DOMAIN_SCRIPT,
        NEXT_PUBLIC_WEBINAR_QUESTION_API_KEY: process.env.NEXT_PUBLIC_WEBINAR_QUESTION_API_KEY,
        NEXT_PUBLIC_COGNITO_IDENTITY_POOL_ID: process.env.NEXT_PUBLIC_COGNITO_IDENTITY_POOL_ID,
        NEXT_PUBLIC_WEBINAR_QUESTION_LIFETIME_IN_SECONDS: process.env.NEXT_PUBLIC_WEBINAR_QUESTION_LIFETIME_IN_SECONDS,
        NEXT_PUBLIC_CHATBOT_HOST: process.env.NEXT_PUBLIC_CHATBOT_HOST,
        NEXT_PUBLIC_CHATBOT_ACTIVE: process.env.NEXT_PUBLIC_CHATBOT_ACTIVE,
        NEXT_PUBLIC_MATOMO_SCRIPT_SRC: process.env.NEXT_PUBLIC_MATOMO_SCRIPT_SRC,
        NEXT_PUBLIC_CHAT_MAX_HISTORY_MESSAGES: process.env.NEXT_PUBLIC_CHAT_MAX_HISTORY_MESSAGES,
        NEXT_PUBLIC_ORGANIZATION_NAME: process.env.NEXT_PUBLIC_ORGANIZATION_NAME,
        NEXT_PUBLIC_ORGANIZATION_SOCIAL_LINKS: process.env.NEXT_PUBLIC_ORGANIZATION_SOCIAL_LINKS,
        NEXT_PUBLIC_ORGANIZATION_LOGO: process.env.NEXT_PUBLIC_ORGANIZATION_LOGO,
        NEXT_PUBLIC_WEBSITE_NAME: process.env.NEXT_PUBLIC_WEBSITE_NAME,
        FETCH_FROM_STRAPI: process.env.FETCH_FROM_STRAPI,
        STRAPI_ENDPOINT: process.env.STRAPI_ENDPOINT,
        STRAPI_API_TOKEN: process.env.STRAPI_API_TOKEN,
      }
    };
  },
  async run() {
    new sst.aws.Nextjs("MyWeb");
  },
});

/* eslint-disable prettier/prettier */
import {
  baseUrl,
  cookieCategory,
  cookieDomainScript,
  cookieScriptUrl,
  isChatbotActive,
  isProduction,
  matomoScriptSrc,
  SITE_HEADER_HEIGHT,
  useNewCookie,
} from '@/config';
import { Metadata } from 'next';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import '@/styles/globals.css';
import ThemeRegistry from '../ThemeRegistry';
import { getProducts } from '@/lib/api';
import SiteFooter from '@/components/atoms/SiteFooter/SiteFooter';
import SiteHeader from '@/components/molecules/SiteHeader/SiteHeader';
import { notFound } from 'next/navigation';
import AuthProvider from '@/components/organisms/Auth/AuthProvider';
import CookieBannerScript from '@/components/atoms/CookieBannerScript/CookieBannerScript';
import BodyWrapper from '@/components/atoms/BodyWrapper/BodyWrapper';
import Script from 'next/script';
import { Titillium_Web } from 'next/font/google';
import NextIntlContext from '@/components/atoms/NextIntlContext/NextIntlContext';
import ChatbotProvider from '@/components/organisms/ChatbotProvider/ChatbotProvider';
import { ErrorBoundary } from 'next/dist/client/components/error-boundary';
import Error from './error';
import { Box } from '@mui/material';

// TODO: remove PREVIOUS_MATOMO_TAG_MANAGER_SCRIPT script, usePreviousScript when the migration to the new tag manager is completed
const PREVIOUS_MATOMO_TAG_MANAGER_SCRIPT =
  `
  var _mtm = window._mtm = window._mtm || [];
  _mtm.push({'mtm.startTime': (new Date().getTime()), 'event': 'mtm.Start'});
  (function() {
    var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
    g.async=true; g.src='` +
  matomoScriptSrc +
  `'; s.parentNode.insertBefore(g,s);
  })();
`;
const MATOMO_TAG_MANAGER_SCRIPT =
  `
  var _mtm = window._mtm = window._mtm || [];
  var waitForTrackerCount = 0;
  function matomoWaitForTracker() {
    if (typeof _mtm === 'undefined' || typeof OnetrustActiveGroups === 'undefined') {
      if (waitForTrackerCount < 40) {
        setTimeout(matomoWaitForTracker, 250);
        waitForTrackerCount++;
        return;
      }
    } else {
      window.addEventListener('OneTrustGroupsUpdated', function () {
        consentSet();
      });
    }
  }

  function consentSet() {
    if (OnetrustActiveGroups.includes("${cookieCategory}")) {
      _mtm.push({ event: 'consent_given' });
        _mtm.push({'mtm.startTime': (new Date().getTime()), 'event': 'mtm.Start'});
      var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
    g.async=true; g.src='` +
  matomoScriptSrc +
  `'; s.parentNode.insertBefore(g,s);
    } else {
      _mtm.push({ event: 'consent_withdrawn' });
    }
  }

  matomoWaitForTracker();
`;

const titilliumWeb = Titillium_Web({
  fallback: ['serif'],
  subsets: ['latin'],
  style: 'normal',
  variable: '--font-titillium-web',
  weight: ['400', '600', '700'],
});

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
};

export default async function RootLayout({
  // Layouts must accept a children prop.
  // This will be populated with nested layouts or pages
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const products = [...(await getProducts(locale)).filter((product) => product.isVisible)];

  // Disabled eslint rules to to follow https://next-intl-docs.vercel.app/docs/getting-started/app-router-client-components guide
  // eslint-disable-next-line functional/no-let
  let messages;
  // eslint-disable-next-line functional/no-try-statements
  try {
    messages = (await import(`../../messages/${locale}.json`)).default;
  } catch {
    notFound();
  }


  return (
    <html lang={locale} className={titilliumWeb.variable}>
      <head>
        {isProduction && (
          <Script
            id="matomo-tag-manager"
            key="script-matomo-tag-manager"
            dangerouslySetInnerHTML={{
              __html: useNewCookie
                ? MATOMO_TAG_MANAGER_SCRIPT
                : PREVIOUS_MATOMO_TAG_MANAGER_SCRIPT,
            }}
            strategy="lazyOnload"
          />
        )}
      </head>
      <ThemeRegistry options={{ key: 'mui' }}>
        <NextIntlContext
          locale={locale}
          messages={messages}
          timeZone="Europe/Rome"
        >
          <BodyWrapper>
            <CookieBannerScript
              cookieDomainScript={cookieDomainScript}
              cookieScript={
                useNewCookie
                  ? cookieScriptUrl
                  : 'https://cdn.cookielaw.org/scripttemplates/otSDKStub.js'
              }
            />
            <AuthProvider>
              <ChatbotProvider isChatbotVisible={isChatbotActive}>
                <SiteHeader currentLocale={locale} products={products} />
                <ErrorBoundary errorComponent={Error}>
                  <main>
                    <Box sx={{ marginTop: `${SITE_HEADER_HEIGHT}px` }}>
                      {children}
                    </Box>
                  </main>
                </ErrorBoundary>
                <SiteFooter />
              </ChatbotProvider>
            </AuthProvider>
          </BodyWrapper>
        </NextIntlContext>
      </ThemeRegistry>
    </html>
  );
}

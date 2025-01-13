import {
  baseUrl,
  cookieDomainScript,
  isChatbotActive,
  isProduction,
  matomoScriptSrc,
} from '@/config';
import { Metadata } from 'next';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import '@/styles/globals.css';
import '@/polyfill';
import ThemeRegistry from './ThemeRegistry';
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

const MATOMO_SCRIPT =
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

export function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'it' }];
}

export default async function RootLayout({
  // Layouts must accept a children prop.
  // This will be populated with nested layouts or pages
  children,
}: {
  children: React.ReactNode;
}) {
  const products = [...(await getProducts())];

  // Disabled eslint rules to to follow https://next-intl-docs.vercel.app/docs/getting-started/app-router-client-components guide
  // eslint-disable-next-line functional/no-let
  let messages;
  // eslint-disable-next-line functional/no-try-statements
  try {
    messages = (await import('../messages/it.json')).default;
  } catch (error) {
    notFound();
  }

  return (
    <html lang='it' className={titilliumWeb.variable}>
      <head>
        <Script
          id='matomo'
          key='script-matomo'
          dangerouslySetInnerHTML={{ __html: MATOMO_SCRIPT }}
          strategy='lazyOnload'
        />
      </head>
      <ThemeRegistry options={{ key: 'mui' }}>
        <NextIntlContext
          locale={'it'}
          messages={messages}
          timeZone='Europe/Rome'
        >
          <BodyWrapper>
            <CookieBannerScript cookieDomainScript={cookieDomainScript} />
            <AuthProvider>
              <ChatbotProvider isChatbotVisible={isChatbotActive}>
                <SiteHeader products={products} />
                <main>{children}</main>
                <SiteFooter />
              </ChatbotProvider>
            </AuthProvider>
          </BodyWrapper>
        </NextIntlContext>
      </ThemeRegistry>
    </html>
  );
}

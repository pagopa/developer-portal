import { baseUrl, cookieDomainScript, isProduction } from '@/config';
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
import { NextIntlClientProvider } from 'next-intl';
import AuthProvider from '@/components/organisms/Auth/AuthProvider';
import CookieBannerScript from '@/components/atoms/CookieBannerScript/CookieBannerScript';
import BodyWrapper from '@/components/atoms/BodyWrapper/BodyWrapper';
import Script from 'next/script';

const MATOMO_SCRIPT = `
var _paq = (window._paq = window._paq || []);
/* tracker methods like "setCustomDimension" should be called before "trackPageView" */
_paq.push(["trackPageView"]);
_paq.push(["enableLinkTracking"]);
(function () {
  var u = "https://pagopa.matomo.cloud/";
  _paq.push(["setTrackerUrl", u + "matomo.php"]);
  _paq.push(["setSiteId", "8"]);
  var d = document,
    g = d.createElement("script"),
    s = d.getElementsByTagName("script")[0];
  g.async = true;
  g.src = "//cdn.matomo.cloud/pagopa.matomo.cloud/matomo.js";
  s.parentNode.insertBefore(g, s);
})();
`;

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
    <html lang='it'>
      <head>
        {isProduction && (
          <Script
            id='matomo'
            key='script-matomo'
            dangerouslySetInnerHTML={{ __html: MATOMO_SCRIPT }}
            strategy='lazyOnload'
          />
        )}
      </head>
      <ThemeRegistry options={{ key: 'mui' }}>
        <NextIntlClientProvider locale={'it'} messages={messages}>
          <BodyWrapper>
            <CookieBannerScript cookieDomainScript={cookieDomainScript} />
            <AuthProvider>
              <SiteHeader products={products} />
              <main>{children}</main>
              <SiteFooter />
            </AuthProvider>
          </BodyWrapper>
        </NextIntlClientProvider>
      </ThemeRegistry>
    </html>
  );
}

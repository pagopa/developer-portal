import { cookieDomainScript, isProduction } from '@/config';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import '@/styles/globals.css';
import ThemeRegistry from './ThemeRegistry';
import { getProducts } from '@/lib/api';
import SiteFooter from '@/components/atoms/SiteFooter/SiteFooter';
import SiteHeader from '@/components/molecules/SiteHeader/SiteHeader';
import MainWrapper from '@/components/atoms/MainWrapper/MainWrapper';
import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import AuthProvider from '@/components/organisms/Auth/AuthProvider';

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

function makeCookieScript(dataDomainScript?: string) {
  return `
    <script
      src="https://cdn.cookielaw.org/scripttemplates/otSDKStub.js"
      type="text/javascript"
      charset="UTF-8"
      data-domain-script="${dataDomainScript}"></script>
    <script type="text/javascript"> function OptanonWrapper() { } </script>
  `;
}

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
  const COOKIE_SCRIPT = makeCookieScript(cookieDomainScript);

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
        <meta name='robots' content='noindex,nofollow' />
        <title>PagoPA DevPortal</title>
        {isProduction && (
          <script
            key='script-matomo'
            dangerouslySetInnerHTML={{ __html: MATOMO_SCRIPT }}
          />
        )}
      </head>
      <ThemeRegistry options={{ key: 'mui' }}>
        <NextIntlClientProvider locale={'it'} messages={messages}>
          <body>
            {isProduction && (
              <div
                key='script-cookie'
                dangerouslySetInnerHTML={{ __html: COOKIE_SCRIPT }}
              ></div>
            )}
            <AuthProvider>
              <SiteHeader products={products} />
              <MainWrapper>{children}</MainWrapper>
              <SiteFooter />
            </AuthProvider>
          </body>
        </NextIntlClientProvider>
      </ThemeRegistry>
    </html>
  );
}

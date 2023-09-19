import { cookieDomainScript, environment } from '@/config';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import '@/styles/globals.css';
import { NextIntlClientProvider } from 'next-intl';
import { notFound } from 'next/navigation';
// import { createTheme, ThemeProvider } from '@mui/material';
// import { theme as muiItaliaTheme } from '@pagopa/mui-italia';
import ThemeRegistry from './ThemeRegistry';

// export const theme = createTheme(muiItaliaTheme);

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
  return `<!-- Inizio informativa di consenso dei cookie OneTrust per developer.pagopa.it -->
  <script src="https://cdn.cookielaw.org/scripttemplates/otSDKStub.js"  type="text/javascript" charset="UTF-8" data-domain-script="${dataDomainScript}" ></script>
  <script type="text/javascript">
  function OptanonWrapper() { }
  </script>
  <!-- Fine informativa di consenso dei cookie OneTrust per developer.pagopa.it -->`;
}

export function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'it' }];
}

export default async function RootLayout({
  // Layouts must accept a children prop.
  // This will be populated with nested layouts or pages
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const messages = (await import(`../../../messages/${locale}.json`)).default;
  const COOKIE_SCRIPT = makeCookieScript(cookieDomainScript);
  return (
    <html lang={locale}>
      <head>
        <meta name='robots' content='noindex,nofollow' />
        {environment === 'prod' && (
          <script
            key='script-matomo'
            dangerouslySetInnerHTML={{ __html: MATOMO_SCRIPT }}
          />
        )}
        {environment === 'prod' && (
          <script
            key='script-cookie'
            dangerouslySetInnerHTML={{ __html: COOKIE_SCRIPT }}
          />
        )}
        <link rel='icon' href='favicon.svg' />
      </head>
      <ThemeRegistry options={{ key: 'mui' }}>
        <body>
          <NextIntlClientProvider locale={locale} messages={messages}>
            {children}
          </NextIntlClientProvider>
        </body>
      </ThemeRegistry>
    </html>
  );
}

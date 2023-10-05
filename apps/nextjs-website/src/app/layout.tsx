import { cookieDomainScript, environment } from '@/config';
import { Metadata } from 'next';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import '@/styles/globals.css';
import ThemeRegistry from './ThemeRegistry';

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

export const metadata: Metadata = {
  metadataBase: new URL('https://developer.pagopa.it'),
};

export default function RootLayout({
  // Layouts must accept a children prop.
  // This will be populated with nested layouts or pages
  children,
}: {
  children: React.ReactNode;
}) {
  const COOKIE_SCRIPT = makeCookieScript(cookieDomainScript);
  return (
    <html lang='it'>
      <head>
        <meta name='robots' content='noindex,nofollow' />
        {environment === 'prod' && (
          <script
            key='script-matomo'
            dangerouslySetInnerHTML={{ __html: MATOMO_SCRIPT }}
          />
        )}
      </head>
      <ThemeRegistry options={{ key: 'mui' }}>
        <body>
          {environment === 'prod' && (
            <div
              key='script-cookie'
              dangerouslySetInnerHTML={{ __html: COOKIE_SCRIPT }}
            ></div>
          )}
          {children}
        </body>
      </ThemeRegistry>
    </html>
  );
}

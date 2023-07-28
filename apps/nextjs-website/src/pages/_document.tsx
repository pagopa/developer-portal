import { cookieDomainScript, environment } from '@/config';
import { Html, Head, Main, NextScript } from 'next/document';

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

export default function Document() {
  const COOKIE_SCRIPT = makeCookieScript(cookieDomainScript);
  return (
    <Html lang='en'>
      <Head>
        <meta name='robots' content='noindex,nofollow' />
        {environment === 'prod' && (
          <script
            key='script-matomo'
            dangerouslySetInnerHTML={{ __html: MATOMO_SCRIPT }}
          />
        )}
        <div dangerouslySetInnerHTML={{ __html: COOKIE_SCRIPT }} />
        <link rel='icon' href='favicon.svg' />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

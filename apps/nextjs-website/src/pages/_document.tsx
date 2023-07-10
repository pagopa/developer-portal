import { environment } from '@/config';
import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  const matomo = `
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

  return (
    <Html lang='en'>
      <Head>
        <meta name='robots' content='noindex,nofollow' />
        {environment === 'prod' && (
          <script
            key='script-matomo'
            dangerouslySetInnerHTML={{ __html: matomo }}
          />
        )}
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

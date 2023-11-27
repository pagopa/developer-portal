'use client';
import { isProduction } from '@/config';

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

type CookieBannerScriptProps = {
  cookieDomainScript?: string;
};

const CookieBannerScript = ({
  cookieDomainScript,
}: CookieBannerScriptProps) => {
  const COOKIE_SCRIPT = makeCookieScript(cookieDomainScript);

  return (
    isProduction && (
      <div
        key='script-cookie'
        dangerouslySetInnerHTML={{ __html: COOKIE_SCRIPT }}
      />
    )
  );
};

export default CookieBannerScript;

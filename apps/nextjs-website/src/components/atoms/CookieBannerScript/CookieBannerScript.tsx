'use client';
import { isProduction } from '@/config';
import Script from 'next/script';
type CookieBannerScriptProps = {
  cookieDomainScript?: string;
};

const CookieBannerScript = ({
  cookieDomainScript,
}: CookieBannerScriptProps) => {
  return (
    isProduction && (
      <>
        <Script
          src='https://cdn.cookielaw.org/scripttemplates/otSDKStub.js'
          type='text/javascript'
          data-domain-script={cookieDomainScript}
          strategy='afterInteractive'
        />
        <Script
          id='optanonwrapper'
          type='text/javascript'
          strategy='afterInteractive'
          dangerouslySetInnerHTML={{
            __html: `function OptanonWrapper() {}`,
          }}
        />
      </>
    )
  );
};

export default CookieBannerScript;

'use client';
import { isProduction } from '@/config';
import Script from 'next/script';
type CookieBannerScriptProps = {
  cookieDomainScript?: string;
  cookieScript?: string;
};

const CookieBannerScript = ({
  cookieDomainScript,
  cookieScript
}: CookieBannerScriptProps) => {
  return (
    isProduction && (
      <>
        <Script
          src={cookieScript}
          type='text/javascript'
          data-domain-script={cookieDomainScript}
          strategy='afterInteractive'
        />
        <Script
          id='optanonwrapper'
          type='text/javascript'
          strategy='afterInteractive'
          dangerouslySetInnerHTML={{
            __html: `function OptanonWrapper() {}`
          }}
        />
      </>
    )
  );
};

export default CookieBannerScript;

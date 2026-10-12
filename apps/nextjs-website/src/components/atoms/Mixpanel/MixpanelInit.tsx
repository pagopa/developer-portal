'use client';
import mixpanel from 'mixpanel-browser';
import { useEffect } from 'react';
import { hasConsent, OTWindow } from './ConsentCheck';

type MixpanelConfig = {
  token?: string;
  apiHost?: string;
  cookieDomain?: string;
  enableMixpanel: boolean;
};

const MixpanelInit = (config: MixpanelConfig) => {
  useEffect(() => {
    const initMixpanel = () => {
      if (!config || !config.enableMixpanel || !config.token) return;

      mixpanel.init(config.token, {
        ...(config.apiHost && { api_host: config.apiHost }),
        ...(config.cookieDomain && {
          cookie_domain: config.cookieDomain,
        }), // allow across-subdomain
        cookie_expiration: 0, // session cookie
        ip: true,
        persistence: 'cookie',
        secure_cookie: true,
        batch_requests: false,
        track_pageview: 'full-url', // Consider any URL change (including query params and hash) as a page change
      });
    };

    const otWindow = window as unknown as OTWindow;
    // eslint-disable-next-line functional/immutable-data
    otWindow.OptanonWrapper = function () {
      otWindow.OneTrust.OnConsentChanged(() => {
        if (hasConsent()) {
          initMixpanel();
        }
      });
    };

    if (hasConsent()) {
      initMixpanel();
    }
  }, [config]);

  return null;
};

export default MixpanelInit;

import mixpanel from 'mixpanel-browser';
import { useEffect } from 'react';

interface OTWindow extends Window {
  // eslint-disable-next-line functional/no-return-void
  OptanonWrapper: () => void;
  OneTrust: {
    // eslint-disable-next-line functional/no-return-void
    OnConsentChanged: (callback: () => void) => void;
    // eslint-disable-next-line functional/no-return-void
    ToggleInfoDisplay: () => void;
  };
}

const targCookiesGroup = 'C0002'; // Target cookies (Mixpanel)

// Reading cookie instead of checking window.OneTrust.OptanonActiveGroups
// because it will NEVER be instantiated at page load when we first check
const hasConsent = () => {
  const OTCookieValue: string =
    document.cookie
      .split('; ')
      .find((row) => row.startsWith('OptanonConsent=')) || '';
  const checkValue = `${targCookiesGroup}%3A1`;
  return OTCookieValue.indexOf(checkValue) > -1;
};

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

    // eslint-disable-next-line functional/immutable-data
    const otWindow = window as unknown as OTWindow;
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

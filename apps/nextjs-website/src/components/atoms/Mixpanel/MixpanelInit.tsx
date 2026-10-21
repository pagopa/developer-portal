'use client';
import mixpanel from 'mixpanel-browser';
import { useEffect } from 'react';
import { hasConsent, OTWindow } from './ConsentCheck';

type MixpanelConfig = {
  token?: string;
  apiHost?: string;
  enableMixpanel: boolean;
};

const mixpanelOptOut = () => {
  try {
    mixpanel.disable();
  } catch {
    // Mixpanel is not initalized
  }
}

const MixpanelInit = (config: MixpanelConfig) => {
  useEffect(() => {
    const initMixpanel = () => {
      console.log(
        'Initializing Mixpanel with config: ',
        JSON.stringify(config)
      );

      if (!config || !config.enableMixpanel || !config.token) return;

      mixpanel.init(config.token, {
        api_host: config.apiHost ?? 'https://api-eu.mixpanel.com', // Fallback to default EU servers
        cookie_expiration: 0, // session cookie
        ip: true,
        persistence: 'cookie',
        secure_cookie: true,
        batch_requests: false,
        track_pageview: 'full-url', // Consider any URL change (including query params and hash) as a page change
        debug: true,
      });

      console.log('Mixpanel tracking initialized');
    };

    const otWindow = window as unknown as OTWindow;
    // eslint-disable-next-line functional/immutable-data
    otWindow.OptanonWrapper = function () {
      otWindow.OneTrust.OnConsentChanged(() => {
        if (hasConsent()) {
          initMixpanel();
        } else {
          mixpanelOptOut();
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

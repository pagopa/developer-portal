'use client';
import mixpanel from 'mixpanel-browser';
import { useEffect } from 'react';
import { hasConsent, OTWindow } from './ConsentCheck';
import { handleOutboundLinkClick } from './TrackOutboundLink';

type MixpanelConfig = {
  token?: string;
  apiHost?: string;
  enableMixpanel: boolean;
};

const disableMixpanel = () => {
  // eslint-disable-next-line functional/no-try-statements
  try {
    mixpanel.disable();
  } catch {
    // Mixpanel is not initalized
  }
};

const MixpanelInit = (config: MixpanelConfig) => {
  useEffect(() => {
    const initMixpanel = () => {
      if (!config || !config.enableMixpanel || !config.token) return;

      mixpanel.init(config.token, {
        api_host: config.apiHost ?? 'https://api-eu.mixpanel.com', // Fallback to default EU servers
        cookie_expiration: 0, // session cookie
        ip: true,
        persistence: 'cookie',
        secure_cookie: true,
        batch_requests: false,
        track_pageview: 'full-url', // Consider any URL change (including query params and hash) as a page change
      });
      if ('enable' in mixpanel && typeof mixpanel.enable === 'function') {
        mixpanel.enable();
      }
    };

    const otWindow = window as unknown as OTWindow;
    // eslint-disable-next-line functional/immutable-data
    otWindow.OptanonWrapper = function () {
      otWindow.OneTrust.OnConsentChanged(() => {
        if (hasConsent()) {
          initMixpanel();
        } else {
          // Disable Mixpanel immediately when user rejects Performance Cookies
          // Mixpanel will simply not be initialized starting from next session
          disableMixpanel();
        }
      });
    };

    if (hasConsent()) {
      initMixpanel();
    }
  }, [config]);

  useEffect(() => {
    if (!config.enableMixpanel || !config.token) {
      return undefined;
    }

    const onClick = (event: MouseEvent) => {
      if ((event.type === 'click' || event.button === 1) && hasConsent()) {
        handleOutboundLinkClick(event);
      }
    };

    document.addEventListener('click', onClick, true);
    document.addEventListener('auxclick', onClick, true);
    return () => {
      document.removeEventListener('click', onClick, true);
      document.removeEventListener('auxclick', onClick, true);
    };
  }, [config.enableMixpanel, config.token]);

  return null;
};

export default MixpanelInit;

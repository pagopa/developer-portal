import mixpanel from 'mixpanel-browser';
import { isExternalLink } from '@/helpers/navigation.helpers';

const trackOutboundLink = (url: string) => {
  // eslint-disable-next-line functional/no-try-statements
  try {
    const destination = new URL(url, window.location.href);
    if (!isExternalLink(window.location.hostname, destination.href)) {
      return;
    }

    // eslint-disable-next-line functional/no-expression-statements
    mixpanel.track(
      'Outbound Link Clicked',
      { url: destination.origin + destination.pathname },
      { transport: 'sendBeacon' }
    );
  } catch {
    // Allow navigation even when tracking fails.
  }
};

export const handleOutboundLinkClick = (event: MouseEvent) => {
  if (!(event.target instanceof Element)) {
    return;
  }

  const link = event.target.closest(
    event.type === 'auxclick' ? 'a[href]' : 'a[href], [data-navigation-href]'
  );
  const href =
    link instanceof HTMLAnchorElement
      ? link.href
      : link?.getAttribute('data-navigation-href');

  if (href) {
    // eslint-disable-next-line functional/no-expression-statements
    trackOutboundLink(href);
  }
};

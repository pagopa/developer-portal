'use client';
import { useUser } from '@/helpers/user.helper';
import { Webinar } from '@/lib/webinars/types';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

interface QualtricsWindow {
  qualtricsEmbeddedData?: Record<string, string>;
}

type QualtricsInterceptProps = {
  webinars: {
    it: ReadonlyArray<Webinar>;
    en: ReadonlyArray<Webinar>;
  };
};

const toIsoDate = (epochSeconds: string): string => {
  const date = new Date(Number(epochSeconds) * 1000);
  return Number.isNaN(date.getTime()) ? '' : date.toISOString();
};

const QualtricsIntercept = ({ webinars }: QualtricsInterceptProps) => {
  const { user, webinarCertificates } = useUser();
  const pathname = usePathname();

  useEffect(() => {
    const script = Object.assign(document.createElement('script'), {
      type: 'text/javascript',
      src: 'https://zn1dbdheb2vgg54ei-pagopa.siteintercept.qualtrics.com/SIE/?Q_ZID=ZN_1dbDHeb2VGg54EI',
    });

    if (user && user.attributes['custom:survey_accepted']) {
      // eslint-disable-next-line functional/immutable-data
      (window as QualtricsWindow).qualtricsEmbeddedData = {
        FirstName: user.attributes.given_name,
        LastName: user.attributes.family_name,
        email: user.attributes.email,
        ruolo: user.attributes['custom:job_role'],
        azienda: user.attributes['custom:company_type'],
        FirstVisitDate: toIsoDate(
          user.attributes['custom:first_login'] ??
            String(Math.floor(Date.now() / 1000))
        ), // If no first_login, now is the first login
        PageUrl: pathname,
      };

      if (['/', '/it', '/en'].includes(pathname)) {
        // Homepage, only show survey if second login or more
        if (sessionStorage.getItem('isFirstLogin') === 'false') {
          document.body.appendChild(script);
        }
      } else if (pathname.endsWith('webinars')) {
        // Webinars overview page, only show survey if user has completed at least one webinar before
        if (webinarCertificates.length > 0) {
          const sortedWebinarCertificates = webinarCertificates.toSorted(
            (a, b) =>
              new Date(b.reached_80_percent_at).getTime() -
              new Date(a.reached_80_percent_at).getTime()
          );
          const mostRecentWebinarID = sortedWebinarCertificates[0].webinarid;

          // Find most recent webinar's data without knowing its locale
          // (currently not returned by /certificate endpoint)
          const allWebinars = webinars.it.concat(webinars.en);
          const mostRecentWebinarData = allWebinars.find(
            (webinar) => webinar.slug === mostRecentWebinarID
          );

          if (mostRecentWebinarData) {
            // eslint-disable-next-line functional/immutable-data
            (window as QualtricsWindow).qualtricsEmbeddedData = {
              ...(window as QualtricsWindow).qualtricsEmbeddedData,
              WebinarName: mostRecentWebinarData.title,
              ...(mostRecentWebinarData.tag && {
                WebinarType: mostRecentWebinarData.tag.name,
              }),
            };
          }

          document.body.appendChild(script);
        }
      } else {
        document.body.appendChild(script);
      }
    }

    return () => {
      // The pathname dependency currently means that the script gets removed at every page change
      script.remove();
      // Minimize how long user data is readable on window by other scripts on the page
      // eslint-disable-next-line functional/immutable-data
      delete (window as QualtricsWindow).qualtricsEmbeddedData;
    };
  }, [user, pathname, webinarCertificates]);

  return <div id='ZN_1dbDHeb2VGg54EI' />;
};

export default QualtricsIntercept;

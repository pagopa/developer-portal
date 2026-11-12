'use client';
import { useUser } from '@/helpers/user.helper';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

interface Window {
  qualtricsEmbeddedData?: Record<string, string>;
}

const toIsoDate = (epochSeconds: string): string => {
  const date = new Date(Number(epochSeconds) * 1000);
  return Number.isNaN(date.getTime()) ? '' : date.toISOString();
};

const QualtricsIntercept = () => {
  const { user, webinarCertificates } = useUser();
  const pathname = usePathname();

  useEffect(() => {
    const script = Object.assign(document.createElement('script'), {
      type: 'text/javascript',
      src: 'https://zn1dbdheb2vgg54ei-pagopa.siteintercept.qualtrics.com/SIE/?Q_ZID=ZN_1dbDHeb2VGg54EI',
    });

    if (user && user.attributes['custom:survey_accepted']) {
      (window as Window).qualtricsEmbeddedData = {
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
          document.body.appendChild(script);
        }
      } else {
        document.body.appendChild(script);
      }
    }

    return () => {
      // The pathname dependency currently means that the script gets removed at every page change
      script.remove();
    };
  }, [user, pathname, webinarCertificates]);

  return <div id='ZN_1dbDHeb2VGg54EI' />;
};

export default QualtricsIntercept;

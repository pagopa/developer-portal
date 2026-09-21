'use client';
import { useUser } from '@/helpers/user.helper';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

const QualtricsIntercept = () => {
  const { user } = useUser();
  const pathname = usePathname();

  useEffect(() => {
    const script = Object.assign(document.createElement('script'), {
      type: 'text/javascript',
      src: 'https://zn1dbdheb2vgg54ei-pagopa.siteintercept.qualtrics.com/SIE/?Q_ZID=ZN_1dbDHeb2VGg54EI',
    });

    if (user && user.attributes['custom:survey_accepted']) {
      if (['/', '/it', '/en'].includes(pathname)) {
        console.log(
          'HOMEPAGE - SessionStorage value: ',
          sessionStorage.getItem('isFirstLogin'),
        );
        // Homepage, only show survey if second login or more
        if (sessionStorage.getItem('isFirstLogin') === 'false') {
          document.body.appendChild(script);
          console.log('HOMEPAGE - Script loaded');
        }
      } else {
        document.body.appendChild(script);
      }
    }

    return () => {
      // The pathname dependency currently means that the script gets removed at every page change
      script.remove();
    };
  }, [user, pathname]);

  return <div id='ZN_1dbDHeb2VGg54EI' />;
};

export default QualtricsIntercept;

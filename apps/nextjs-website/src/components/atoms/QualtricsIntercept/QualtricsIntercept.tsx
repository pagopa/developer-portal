'use client';
import { useUser } from '@/helpers/user.helper';
import { useEffect } from 'react';

const QualtricsIntercept = () => {
  const { user } = useUser();

  useEffect(() => {
    const script = Object.assign(document.createElement('script'), {
      type: 'text/javascript',
      src: 'https://zn1dbdheb2vgg54ei-pagopa.siteintercept.qualtrics.com/SIE/?Q_ZID=ZN_1dbDHeb2VGg54EI',
    });

    if (user && user.attributes['custom:survey_accepted']) {
      document.body.appendChild(script);
    }

    return () => {
      // Optional cleanup if the component is unmounted.
      script.remove();
    };
  }, [user]);

  return <div id='ZN_1dbDHeb2VGg54EI' />;
};

export default QualtricsIntercept;

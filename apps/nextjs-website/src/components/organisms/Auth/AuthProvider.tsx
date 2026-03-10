'use client';

import { Amplify } from 'aws-amplify';

import { amplifyConfig, authCookieValidityInDays, baseUrl } from '@/config';
import { Authenticator } from '@aws-amplify/ui-react';
import { FC, PropsWithChildren } from 'react';

if (typeof window !== 'undefined') {
  const domain = baseUrl.replace(/^https?:\/\//, '').split(':')[0];
  Amplify.configure({
    ...amplifyConfig,
    Auth: {
      ...amplifyConfig.Auth,
      cookieStorage: {
        domain: domain,
        path: '/',
        expires: authCookieValidityInDays,
        secure: window.location.protocol === 'https:',
      },
    },
  });
} else {
  Amplify.configure(amplifyConfig);
}

const AuthProvider: FC<PropsWithChildren> = ({ children }) => {
  return <Authenticator.Provider>{children}</Authenticator.Provider>;
};

export default AuthProvider;

'use client';

import { Amplify } from 'aws-amplify';

import { amplifyConfig } from '@/config';
import { Authenticator } from '@aws-amplify/ui-react';
import { FC, PropsWithChildren } from 'react';

if (typeof window !== 'undefined') {
  Amplify.configure({
    ...amplifyConfig,
    Auth: {
      ...amplifyConfig.Auth,
      cookieStorage: {
        domain: window.location.hostname,
        path: '/',
        expires: 365,
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

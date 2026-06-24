/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-return-void */
'use client';

import { Amplify, Auth, Hub } from 'aws-amplify';

import {
  amplifyConfig,
  authCookieValidityInDays,
  baseUrl,
  loggedInCookieName,
} from '@/config';
import { Authenticator } from '@aws-amplify/ui-react';
import { FC, PropsWithChildren, useEffect } from 'react';

Amplify.configure(amplifyConfig);

function getAuthCookieAttributes(): string {
  const domain = baseUrl.replace(/^https?:\/\//, '').split(':')[0];
  const secure = window.location.protocol === 'https:' ? '; Secure' : '';
  return `path=/; domain=${domain}; SameSite=Lax${secure}`;
}

function setLoggedInCookie(): void {
  const expires = new Date();
  expires.setDate(expires.getDate() + authCookieValidityInDays);
  document.cookie = `${loggedInCookieName}=true; ${getAuthCookieAttributes()}; expires=${expires.toUTCString()}`;
}

function deleteLoggedInCookie(): void {
  document.cookie = `${loggedInCookieName}=; ${getAuthCookieAttributes()}; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
}

const AuthProvider: FC<PropsWithChildren> = ({ children }) => {
  useEffect(() => {
    // Restore or clear the sentinel cookie on page load based on current session state
    Auth.currentAuthenticatedUser()
      .then(setLoggedInCookie)
      .catch(deleteLoggedInCookie);

    return Hub.listen('auth', ({ payload: { event } }) => {
      if (event === 'signIn' || event === 'autoSignIn') {
        setLoggedInCookie();
      } else if (event === 'signOut') {
        deleteLoggedInCookie();
      }
    });
  }, []);

  return <Authenticator.Provider>{children}</Authenticator.Provider>;
};

export default AuthProvider;

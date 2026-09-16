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
import { CognitoUser } from '@aws-amplify/auth';

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

async function resolveFirstLogin(): Promise<void> {
  const session = await Auth.currentSession();
  const claim = session.getIdToken().decodePayload()['custom:first_login'];
  const isFirstLogin = !claim;

  if (isFirstLogin) {
    const user = await Auth.currentAuthenticatedUser();
    await Auth.updateUserAttributes(user, {
      'custom:first_login': new Date().toISOString(),
    });
  }

  sessionStorage.setItem('isFirstLogin', String(isFirstLogin));
}

function hydrateFirstLoginOnBoot(user: CognitoUser) {
  const session = user.getSignInUserSession();
  const claim = session?.getIdToken().decodePayload()['custom:first_login'];
  sessionStorage.setItem('isFirstLogin', String(!claim));
}

const AuthProvider: FC<PropsWithChildren> = ({ children }) => {
  useEffect(() => {
    // Restore or clear the sentinel cookie on page load based on current session state
    Auth.currentAuthenticatedUser()
      .then((user) => {
        setLoggedInCookie();
        hydrateFirstLoginOnBoot(user);
      })
      .catch(deleteLoggedInCookie);

    return Hub.listen('auth', ({ payload: { event } }) => {
      if (event === 'signIn' || event === 'autoSignIn') {
        setLoggedInCookie();
        resolveFirstLogin();
      } else if (event === 'signOut') {
        deleteLoggedInCookie();
      }
    });
  }, []);

  return <Authenticator.Provider>{children}</Authenticator.Provider>;
};

export default AuthProvider;

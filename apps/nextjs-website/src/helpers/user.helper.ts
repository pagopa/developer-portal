/* eslint-disable functional/no-expression-statements */
import { DevPortalUser } from '@/lib/types/auth';
import { getUserWebinarSubscriptions } from '@/lib/webinarApi';
import { WebinarSubscription } from '@/lib/webinars/webinarSubscriptions';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { Auth, Hub } from 'aws-amplify';
import { redirect } from 'next/navigation';
import { useCallback, useState, useEffect } from 'react';

export const useUser = () => {
  const { authStatus } = useAuthenticator((context) => [context.authStatus]);
  const [isLoaded, setLoading] = useState<boolean>(true);
  const [aligned, setAligned] = useState<boolean>(false);
  const [user, setUser] = useState<DevPortalUser | null>(null);
  const [webinarSubscriptions, setSubscriptions] = useState<
    readonly WebinarSubscription[]
  >([]);

  const signOutUser = useCallback(async (user?: DevPortalUser | null) => {
    await Auth.signOut();
    if (user?.username) {
      setUser(null);
    }
  }, []);

  const isUserLoggedIn = useCallback(
    async (user?: DevPortalUser | null) => {
      if (authStatus === 'unauthenticated') {
        return false;
      }
      // eslint-disable-next-line functional/no-try-statements
      try {
        const info = await Auth.currentUserInfo();
        if (!info?.username) {
          signOutUser(user);
        }
        return !!info?.username;
      } catch {
        signOutUser(user);
        return false;
      }
    },
    [authStatus, signOutUser]
  );

  const fetchUserAndSubscriptions = useCallback(async () => {
    const user = await Auth.currentAuthenticatedUser().catch(() => {
      setLoading(false);
      setAligned(true);
      setUser(null);
      return null;
    });

    if (!user) {
      return;
    }

    const subscriptions = await getUserWebinarSubscriptions(
      user.username
    ).catch(() => []);

    setLoading(false);
    setAligned(true);
    setUser(user);
    setSubscriptions(subscriptions);
  }, []);

  const setUserAttributes = async (
    attributes: DevPortalUser['attributes'],
    onSuccess?: () => null,
    onFail?: () => null
  ) => {
    setAligned(false);
    return await Auth.updateUserAttributes(user, attributes)
      .then(() => {
        fetchUserAndSubscriptions();
        if (onSuccess) onSuccess();
        setAligned(true);
      })
      .catch(() => {
        if (onFail) onFail();
        setAligned(true);
      });
  };

  const reloadUser = useCallback(async () => {
    setLoading(true);
    await fetchUserAndSubscriptions();
  }, [fetchUserAndSubscriptions]);

  useEffect(() => {
    isUserLoggedIn(user);
  }, [user, isUserLoggedIn]);

  useEffect(() => {
    if (authStatus === 'authenticated') {
      fetchUserAndSubscriptions();
      return;
    }
    if (authStatus === 'unauthenticated') {
      setLoading(false);
      setAligned(true);
      setUser(null);
      setSubscriptions([]);
    }
  }, [authStatus, fetchUserAndSubscriptions]);

  useEffect(() => {
    const cancel = Hub.listen('auth', (event) => {
      switch (event.payload.event) {
        case 'signIn':
        case 'autoSignIn': {
          const { data: user } = event.payload;
          setUser(user);
          break;
        }
        case 'updateUserAttributes_failure':
          signOutUser();
          break;
        case 'signOut':
          setUser(null);
          break;
      }
    });

    return () => cancel();
  }, [signOutUser]);

  const userFullName =
    (user &&
      [user.attributes['given_name'], user.attributes['family_name']].join(
        ' '
      )) ||
    '';

  return {
    user,
    webinarSubscriptions,
    loading: isLoaded,
    setUserAttributes,
    aligned,
    reloadUser,
    isUserLoggedIn,
    userFullName,
  };
};

// We need a middleware to check if the user is authenticated and redirect to the home page if so
export const useAuthenticatedUserRedirect = () => {
  const { authStatus } = useAuthenticator((context) => [context.authStatus]);

  if (authStatus === 'authenticated') {
    redirect('/');
  }

  return authStatus !== 'unauthenticated';
};

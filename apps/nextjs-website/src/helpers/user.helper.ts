/* eslint-disable functional/no-expression-statements */
import { DevPortalUser } from '@/lib/types/auth';
import { getUserWebinarSubscriptions } from '@/lib/webinarApi';
import { WebinarSubscription } from '@/lib/webinars/webinarSubscriptions';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { Auth, Hub } from 'aws-amplify';
import { redirect } from 'next/navigation';
import { useCallback, useState, useEffect } from 'react';

export const useUser = () => {
  const [isLoaded, setLoading] = useState<boolean>(true);
  const [aligned, setAligned] = useState<boolean>(false);
  const [user, setUser] = useState<DevPortalUser | null>(null);
  const [webinarSubscriptions, setSubscriptions] = useState<
    readonly WebinarSubscription[]
  >([]);

  const signOutUser = async (user?: DevPortalUser | null) => {
    await Auth.signOut();
    if (user?.username) {
      setUser(null);
    }
  };

  const isUserLoggedIn = async (user?: DevPortalUser | null) => {
    const info = await Auth.currentUserInfo();
    if (!info?.username) {
      signOutUser(user);
    }
    return !!info?.username;
  };

  const fetchUserAndSubscriptions = useCallback(async () => {
    const user = await Auth.currentAuthenticatedUser().catch((e) => {
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
        onSuccess && onSuccess();
        setAligned(true);
      })
      .catch(() => {
        onFail && onFail();
        setAligned(true);
      });
  };

  const reloadUser = useCallback(async () => {
    setLoading(true);
    await fetchUserAndSubscriptions();
  }, [fetchUserAndSubscriptions]);

  useEffect(() => {
    isUserLoggedIn(user);
  }, [user]);

  useEffect(() => {
    fetchUserAndSubscriptions();
  }, []);

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
  }, []);

  return {
    user,
    webinarSubscriptions,
    loading: isLoaded,
    setUserAttributes,
    aligned,
    reloadUser,
    isUserLoggedIn,
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

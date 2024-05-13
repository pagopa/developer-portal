/* eslint-disable functional/no-expression-statements */
import { DevPortalUser } from '@/lib/types/auth';
import { getUserWebinarSubscriptions } from '@/lib/webinarApi';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { Auth, Hub } from 'aws-amplify';
import { redirect } from 'next/navigation';
import { useCallback, useState, useEffect } from 'react';

export const useUser = () => {
  const [isLoaded, setLoading] = useState<boolean>(true);
  const [aligned, setAligned] = useState<boolean>(false);
  const [user, setUser] = useState<DevPortalUser | null>(null);

  const checkUser = useCallback(() => {
    const run = async () => {
      const user = await Auth.currentAuthenticatedUser().catch(() => {
        setLoading(false);
        setUser(null);
        return null;
      });

      if (!user) {
        return;
      }

      const subscriptions = await getUserWebinarSubscriptions(
        user.attributes.email
      ).catch(() => []);

      setLoading(false);
      setAligned(true);
      setUser({ ...user, webinarSubscriptions: subscriptions });
    };

    run();
  }, []);

  const setUserAttributes = async (
    attributes: DevPortalUser['attributes'],
    onSuccess?: () => null,
    onFail?: () => null
  ) => {
    setAligned(false);
    return await Auth.updateUserAttributes(user, attributes)
      .then(() => {
        checkUser();
        onSuccess && onSuccess();
        setAligned(true);
      })
      .catch(() => {
        onFail && onFail();
        setAligned(true);
      });
  };

  const reloadUser = useCallback(() => {
    setLoading(true);
    checkUser();
  }, [checkUser]);

  useEffect(() => {
    checkUser();
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
        case 'signOut':
          setUser(null);
          break;
      }
    });

    return () => cancel();
  }, []);

  return { user, loading: isLoaded, setUserAttributes, aligned, reloadUser };
};

// We need a middleware to check if the user is authenticated and redirect to the home page if so
export const useAuthenticatedUserRedirect = () => {
  const { authStatus } = useAuthenticator((context) => [context.authStatus]);

  if (authStatus === 'authenticated') {
    redirect('/');
  }

  return authStatus !== 'unauthenticated';
};

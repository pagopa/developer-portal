/* eslint-disable functional/no-expression-statements */
import { DevPortalUser } from '@/lib/types/auth';
import { Auth, Hub } from 'aws-amplify';
import { useCallback, useState, useEffect } from 'react';

export const useUser = () => {
  const [isLoaded, setLoading] = useState<boolean>(true);
  const [aligned, setAligned] = useState<boolean>(false);
  const [user, setUser] = useState<DevPortalUser | null>(null);

  const checkUser = useCallback(() => {
    Auth.currentAuthenticatedUser()
      .then((user) => {
        setLoading(false);
        setAligned(true);
        setUser(user);
      })
      .catch(() => {
        setLoading(false);
        setAligned(true);
        setUser(null);
      });
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

  return { user, loading: isLoaded, setUserAttributes, aligned };
};

/* eslint-disable functional/no-expression-statements */
import { DevPortalUser, DevPortalUserAttributes } from '@/lib/types/auth';
import { Auth, Hub } from 'aws-amplify';
import { useCallback, useState, useEffect } from 'react';

export const useUser = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<DevPortalUser | null>(null);

  const checkUser = useCallback(() => {
    Auth.currentAuthenticatedUser()
      .then((user) => {
        setLoading(false);
        setUser(user);
      })
      .catch(() => {
        setLoading(false);
        setUser(null);
      });
  }, []);

  const setUserAttributes = async (attributes: DevPortalUserAttributes) => {
    return await Auth.updateUserAttributes(user, attributes)
      .then(() => {
        checkUser();
        return true;
      })
      .catch(() => {
        return false;
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

  return { user, loading, setUserAttributes };
};

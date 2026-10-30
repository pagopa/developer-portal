/* eslint-disable functional/no-expression-statements */
'use client';
import type { DevPortalUser } from '@/lib/auth/user/types';
import {
  getUserWebinarCertificates,
  getUserWebinarSubscriptions,
} from '@/lib/webinarApi';
import { WebinarSubscription } from '@/lib/webinars/webinarSubscriptions';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { Auth, Hub } from 'aws-amplify';
import {
  createContext,
  FC,
  useCallback,
  useState,
  useEffect,
  PropsWithChildren,
  useContext,
} from 'react';
import type { CertificateResponse } from '@/lib/webinars/webinarCertificates';
import { isWebinarsEnabled } from '@/config';

type UserContextValue = ReturnType<typeof useUserState>;

const useUserState = () => {
  const { authStatus } = useAuthenticator((context) => [context.authStatus]);
  const [isLoaded, setLoading] = useState<boolean>(true);
  const [aligned, setAligned] = useState<boolean>(false);
  const [user, setUser] = useState<DevPortalUser | null>(null);
  const [webinarSubscriptions, setSubscriptions] = useState<
    readonly WebinarSubscription[]
  >([]);
  const [webinarCertificates, setCertificates] = useState<CertificateResponse>(
    []
  );
  const [webinarDataLoading, setWebinarDataLoading] = useState<boolean>(true);

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

  const fetchUserAndWebinarData = useCallback(async () => {
    const user = await Auth.currentAuthenticatedUser().catch(() => {
      setLoading(false);
      setAligned(true);
      setUser(null);
      setWebinarDataLoading(false);
      return null;
    });

    if (!user) {
      return;
    }

    // Resolve auth state ASAP without having to wait for webinar data to be fetched
    setLoading(false);
    setAligned(true);
    setUser(user);
    setWebinarDataLoading(true);

    // Load webinar data afterwards, webinarDataLoading is used to verify loading state
    const [subscriptions, certificates] = await Promise.all([
      getUserWebinarSubscriptions(user.username).catch(() => []),
      getUserWebinarCertificates().catch(() => []),
    ]);
    setSubscriptions(subscriptions);
    setCertificates(certificates);
    setWebinarDataLoading(false);
  }, []);

  const setUserAttributes = async (
    attributes: DevPortalUser['attributes'],
    onSuccess?: () => null,
    onFail?: () => null
  ) => {
    setAligned(false);
    return await Auth.updateUserAttributes(user, attributes)
      .then(() => {
        fetchUserAndWebinarData();
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
    await fetchUserAndWebinarData();
  }, [fetchUserAndWebinarData]);

  useEffect(() => {
    isUserLoggedIn(user);
  }, [user, isUserLoggedIn]);

  useEffect(() => {
    if (authStatus === 'authenticated') {
      fetchUserAndWebinarData();
      return;
    }
    if (authStatus === 'unauthenticated') {
      setLoading(false);
      setAligned(true);
      setUser(null);
      setSubscriptions([]);
      setCertificates([]);
      setWebinarDataLoading(false);
    }
  }, [authStatus, fetchUserAndWebinarData]);

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

  const email = user?.attributes?.email?.toLowerCase() ?? '';

  const isInternalUser =
    email.endsWith('@pagopa.it') || email.endsWith('@dgsspa.com');

  const canUseWebinarFeatures = isWebinarsEnabled && isInternalUser;

  const userFullName =
    (user &&
      [user.attributes['given_name'], user.attributes['family_name']].join(
        ' '
      )) ||
    '';

  return {
    user,
    webinarSubscriptions,
    webinarCertificates,
    webinarDataLoading,
    loading: isLoaded,
    setUserAttributes,
    aligned,
    reloadUser,
    isUserLoggedIn,
    userFullName,
    canUseWebinarFeatures,
  };
};

const UserContext = createContext<UserContextValue | undefined>(undefined);

// Single source of truth for current user and respective webinar data
// Prevents each useUser() call from triggering a separate fetch to /certificate
export const UserProvider: FC<PropsWithChildren> = ({ children }) => {
  const value = useUserState();
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    // eslint-disable-next-line functional/no-throw-statements
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

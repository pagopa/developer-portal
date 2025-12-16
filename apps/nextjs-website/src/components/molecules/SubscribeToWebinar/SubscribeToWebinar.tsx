'use client';
import React, { useCallback, useEffect, Suspense } from 'react';
import { useState } from 'react';
import SubscribeButton from '../../atoms/SubscribeButton/SubscribeButton';
import { useTranslations } from 'next-intl';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { WebinarState } from '@/helpers/webinar.helpers';
import { subscribeToWebinar, unsubscribeToWebinar } from '@/lib/webinarApi';
import { useUser } from '@/helpers/user.helper';
import Spinner from '../../atoms/Spinner/Spinner';

export type SubscribeButtonProps = {
  webinarSlug?: string;
  isSubscribed: boolean;
  setIsSubscribed: (isSubscribed: boolean) => null;
  handleErrorMessage?: (message: string) => null;
  webinarState: WebinarState;
  textColor?: string;
};

const SubscribeToWebinarContent = ({
  webinarSlug,
  isSubscribed,
  setIsSubscribed,
  handleErrorMessage,
  webinarState,
  textColor = 'white',
}: SubscribeButtonProps) => {
  const t = useTranslations('webinar');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const action = searchParams.get('action');
  const isSubscribeAction = action === 'subscribe';

  const { user, webinarSubscriptions, reloadUser, aligned, isUserLoggedIn } =
    useUser();
  const username = user?.username;

  useEffect(() => {
    if (username && webinarSlug) {
      setIsSubscribed(
        webinarSubscriptions?.some((s) => s.webinarId === webinarSlug) ?? false
      );
    }
  }, [setIsSubscribed, username, webinarSubscriptions, webinarSlug]);

  const onSubscribe = useCallback(async () => {
    if (!webinarSlug || !username) {
      if (handleErrorMessage) handleErrorMessage(t('genericSubscriptionError'));
      return null;
    }

    setIsLoading(true);
    subscribeToWebinar(webinarSlug, username)
      .then(() => {
        reloadUser().then(() => setIsLoading(false));
        if (!pathname.includes(`/webinars/${webinarSlug}`)) {
          // eslint-disable-next-line functional/immutable-data
          router.push(`/webinars/${webinarSlug}`);
        }
      })
      .catch((error) => {
        if (handleErrorMessage) handleErrorMessage(error.message);
        setIsLoading(false);
      });
    return null;
  }, [
    webinarSlug,
    username,
    handleErrorMessage,
    t,
    pathname,
    reloadUser,
    router,
  ]);

  const onSubscribeWithoutUser = () => {
    setIsLoading(true);
    const finalPath = !pathname.includes(`/webinars/${webinarSlug}`)
      ? `/webinars/${webinarSlug}?action=subscribe`
      : `${pathname}?action=subscribe`;

    // eslint-disable-next-line functional/immutable-data
    router.push(`/auth/login?redirect=${btoa(finalPath)}`);
    return null;
  };

  const onUnsubscribe = async () => {
    const userLoggedIn = await isUserLoggedIn(user);
    if (!userLoggedIn || !webinarSlug || !username) {
      if (handleErrorMessage) handleErrorMessage(t('genericSubscriptionError'));
      return null;
    }

    setIsLoading(true);
    unsubscribeToWebinar(webinarSlug, username)
      .then(() => {
        reloadUser().then(() => setIsLoading(false));
      })
      .catch((error) => {
        if (handleErrorMessage) handleErrorMessage(error.message);
        setIsLoading(false);
      });

    return null;
  };

  const onSubscribeClick = async () => {
    const userLoggedIn = await isUserLoggedIn(user);
    if (userLoggedIn || username) {
      return onSubscribe();
    } else {
      return onSubscribeWithoutUser();
    }
  };

  useEffect(() => {
    if (username && isSubscribeAction) {
      onSubscribe();
      router.replace(pathname);
    }
  }, [onSubscribe, pathname, router, isSubscribeAction, username]);

  const subscribeLabelMap = {
    [WebinarState.past]: 'view',
    [WebinarState.comingSoon]: 'default',
    [WebinarState.live]: 'takePart',
    [WebinarState.future]: 'default',
    [WebinarState.unknown]: 'default',
  };

  if (!webinarSlug) {
    return null;
  }

  if (
    isSubscribed &&
    (webinarState === WebinarState.live || webinarState === WebinarState.past)
  ) {
    return null;
  }

  return (
    <SubscribeButton
      disabled={isSubscribeAction || !aligned || isLoading}
      isLoading={isLoading}
      isSubscribed={isSubscribed}
      onSubscribe={onSubscribeClick}
      onCancelSubscription={onUnsubscribe}
      subscribeLabel={subscribeLabelMap[webinarState]}
      textColor={textColor}
    />
  );
};

const SubscribeToWebinar = (props: SubscribeButtonProps) => {
  return (
    <Suspense fallback={<Spinner />}>
      <SubscribeToWebinarContent {...props} />
    </Suspense>
  );
};

export default SubscribeToWebinar;

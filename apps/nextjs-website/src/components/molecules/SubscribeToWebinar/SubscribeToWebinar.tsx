'use client';
import React, { useCallback, useEffect } from 'react';
import { useState } from 'react';
import SubscribeButton from '../../atoms/SubscribeButton/SubscribeButton';
import { useTranslations } from 'next-intl';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { WebinarState } from '@/helpers/webinar.helpers';
import { subscribeToWebinar, unsubscribeToWebinar } from '@/lib/webinarApi';
import { useUser } from '@/helpers/user.helper';

export type SubscribeButtonProps = {
  webinarSlug?: string;
  isSubscribed: boolean;
  setIsSubscribed: (isSubscribed: boolean) => null;
  handleErrorMessage?: (message: string) => null;
  webinarState: WebinarState;
};

const SubscribeToWebinar = ({
  webinarSlug,
  isSubscribed,
  setIsSubscribed,
  handleErrorMessage,
  webinarState,
}: SubscribeButtonProps) => {
  const t = useTranslations('webinar');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const action = searchParams.get('action');
  const isSubscribeAction = action === 'subscribe';

  const { user, reloadUser, aligned } = useUser();
  const username = user?.username;

  useEffect(() => {
    if (username && webinarSlug) {
      setIsSubscribed(
        user?.webinarSubscriptions?.some((s) => s.webinarId === webinarSlug) ??
          false
      );
    }
  }, [setIsSubscribed, username, user?.webinarSubscriptions, webinarSlug]);

  const onSubscribe = useCallback(() => {
    if (!webinarSlug || !username) {
      handleErrorMessage && handleErrorMessage(t('genericSubscriptionError'));
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
        handleErrorMessage && handleErrorMessage(error.message);
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

  const onUnsubscribe = () => {
    if (!webinarSlug || !username) {
      handleErrorMessage && handleErrorMessage(t('genericSubscriptionError'));
      return null;
    }

    setIsLoading(true);
    unsubscribeToWebinar(webinarSlug, username)
      .then(() => {
        reloadUser().then(() => setIsLoading(false));
      })
      .catch((error) => {
        handleErrorMessage && handleErrorMessage(error.message);
        setIsLoading(false);
      });

    return null;
  };

  const onSubscribeClick = () =>
    username ? onSubscribe() : onSubscribeWithoutUser();

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
    />
  );
};

export default SubscribeToWebinar;

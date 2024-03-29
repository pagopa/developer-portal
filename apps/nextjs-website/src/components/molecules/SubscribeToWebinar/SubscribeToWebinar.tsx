'use client';
import React, { useCallback, useEffect } from 'react';
import { useState } from 'react';
import SubscribeButton from '../../atoms/SubscribeButton/SubscribeButton';
import {
  addWebinarSubscriptionToAttributes,
  removeWebinarSubscriptionToAttributes,
  webinarSubscriptionExists,
} from '@/helpers/userPreferences.helpers';
import { useTranslations } from 'next-intl';
import { DevPortalUser } from '@/lib/types/auth';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { WebinarState } from '@/helpers/webinar.helpers';

export type SubscribeButtonProps = {
  webinarSlug?: string;
  userAttributes?: DevPortalUser['attributes'];
  userAligned?: boolean;
  setUserAttributes?: (
    attributes: DevPortalUser['attributes']
  ) => Promise<null>;
  isSubscribed: boolean;
  setIsSubscribed: (isSubscribed: boolean) => null;
  handleErrorMessage?: (message: string) => null;
  webinarState: WebinarState;
};

const SubscribeToWebinar = ({
  webinarSlug,
  userAttributes,
  userAligned,
  setUserAttributes,
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

  useEffect(() => {
    if (userAttributes && webinarSlug) {
      setIsSubscribed(webinarSubscriptionExists(webinarSlug, userAttributes));
    }
  }, [setIsSubscribed, userAttributes, webinarSlug]);

  const onUpdateAttributes = useCallback(
    async (
      generateNewAttributes: (
        slug: string,
        attributes: DevPortalUser['attributes']
      ) => DevPortalUser['attributes'] | Error,
      errorMessage: string
    ): Promise<boolean> => {
      if (!webinarSlug || !userAttributes || !setUserAttributes) {
        handleErrorMessage && handleErrorMessage(t('genericSubscriptionError'));
        return false;
      }
      const subscriptionResponse = generateNewAttributes(
        webinarSlug,
        userAttributes
      );
      if (subscriptionResponse instanceof Error) {
        handleErrorMessage && handleErrorMessage(errorMessage);
        return false;
      } else {
        await setUserAttributes(subscriptionResponse);
        return true;
      }
    },
    [handleErrorMessage, setUserAttributes, t, userAttributes, webinarSlug]
  );

  const onSubscribe = useCallback(() => {
    setIsLoading(true);
    onUpdateAttributes(
      addWebinarSubscriptionToAttributes,
      t('subscriptionError')
    ).then((updateSuccess) => {
      if (updateSuccess) {
        setIsSubscribed(true);
      }
      if (!pathname.includes(`/webinars/${webinarSlug}`)) {
        // eslint-disable-next-line functional/immutable-data
        router.push(`/webinars/${webinarSlug}`);
      }
      setIsLoading(false);
    });
    return null;
  }, [onUpdateAttributes, pathname, router, setIsSubscribed, t, webinarSlug]);

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
    setIsLoading(true);
    onUpdateAttributes(
      removeWebinarSubscriptionToAttributes,
      t('genericSubscriptionError')
    ).then((updateSuccess) => {
      if (updateSuccess) {
        setIsSubscribed(false);
      }
      setIsLoading(false);
    });
    return null;
  };

  const onSubscribeClick = () =>
    userAttributes ? onSubscribe() : onSubscribeWithoutUser();

  useEffect(() => {
    if (userAttributes && isSubscribeAction) {
      onSubscribe();
      router.replace(pathname);
    }
  }, [onSubscribe, pathname, router, isSubscribeAction, userAttributes]);

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
      disabled={isSubscribeAction || !userAligned || isLoading}
      isLoading={isLoading}
      isSubscribed={isSubscribed}
      onSubscribe={onSubscribeClick}
      onCancelSubscription={onUnsubscribe}
      subscribeLabel={subscribeLabelMap[webinarState]}
    />
  );
};

export default SubscribeToWebinar;

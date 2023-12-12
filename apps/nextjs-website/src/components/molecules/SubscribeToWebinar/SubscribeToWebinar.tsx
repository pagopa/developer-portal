'use client';
import React, { useEffect } from 'react';
import { useState } from 'react';
import SubscribeButton from '../../atoms/SubscribeButton/SubscribeButton';
import {
  addWebinarSubscriptionToAttributes,
  removeWebinarSubscriptionToAttributes,
  webinarSubscriptionExists,
} from '@/helpers/userPreferences.helpers';
import { useTranslations } from 'next-intl';
import { DevPortalUser } from '@/lib/types/auth';
import { useRouter } from 'next/navigation';
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

  useEffect(() => {
    if (userAttributes && webinarSlug) {
      setIsSubscribed(webinarSubscriptionExists(webinarSlug, userAttributes));
    }
  }, [userAttributes, webinarSlug]);

  if (!webinarSlug) {
    return null;
  }

  const onUpdateAttributes = async (
    generateNewAttributes: (
      slug: string,
      attributes: DevPortalUser['attributes']
    ) => DevPortalUser['attributes'] | Error,
    errorMessage: string
  ): Promise<boolean> => {
    if (!userAttributes || !setUserAttributes) {
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
  };

  const onSubscribe = () => {
    setIsLoading(true);
    onUpdateAttributes(
      addWebinarSubscriptionToAttributes,
      t('subscriptionError')
    ).then((updateSuccess) => {
      if (updateSuccess) {
        setIsSubscribed(true);
      }
      setIsLoading(false);
    });
    return null;
  };

  const onSubscribeWithoutUser = () => {
    setIsLoading(true);
    // eslint-disable-next-line functional/immutable-data
    router.push('/auth/login');
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

  const subscribeLabelMap = {
    [WebinarState.past]: 'view',
    [WebinarState.comingSoon]: 'takePart',
    [WebinarState.live]: 'takePart',
    [WebinarState.future]: 'default',
    [WebinarState.unknown]: 'default',
  };

  if (
    isSubscribed &&
    (webinarState === WebinarState.live || webinarState === WebinarState.past)
  ) {
    return null;
  }

  return (
    <SubscribeButton
      disabled={!userAligned || isLoading}
      isLoading={isLoading}
      isSubscribed={isSubscribed}
      onSubscribe={userAttributes ? onSubscribe : onSubscribeWithoutUser}
      onCancelSubscription={onUnsubscribe}
      subscribeLabel={subscribeLabelMap[webinarState]}
    />
  );
};

export default SubscribeToWebinar;

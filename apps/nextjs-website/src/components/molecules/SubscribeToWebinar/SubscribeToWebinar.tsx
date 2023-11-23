'use client';
import React from 'react';
import { useState } from 'react';
import SubscribeButton from '../../atoms/SubscribeButton/SubscribeButton';
import {
  addWebinarSubscriptionToAttributes,
  removeWebinarSubscriptionToAttributes,
} from '@/helpers/userPreferences.helpers';
import { useTranslations } from 'next-intl';
import { DevPortalUser } from '@/lib/types/auth';
import { useRouter } from 'next/navigation';

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
};

const SubscribeToWebinar = ({
  webinarSlug,
  userAttributes,
  userAligned,
  setUserAttributes,
  isSubscribed,
  setIsSubscribed,
  handleErrorMessage,
}: SubscribeButtonProps) => {
  const t = useTranslations('webinar');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

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

  return (
    <SubscribeButton
      key={webinarSlug + isSubscribed}
      disabled={!userAligned || isLoading}
      isLoading={isLoading}
      isSubscribed={isSubscribed}
      onSubscribe={userAttributes ? onSubscribe : onSubscribeWithoutUser}
      onCancelSubscription={onUnsubscribe}
    />
  );
};

export default SubscribeToWebinar;

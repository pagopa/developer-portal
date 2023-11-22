'use client';
import React from 'react';
import { useUser } from '@/helpers/user.helper';
import { useState } from 'react';
import SubscribeButton from '../../atoms/SubscribeButton/SubscribeButton';

const SubscribeWebinar = () => {
  const { user, loading: loadingUser } = useUser();
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubscribe = async () => null;
  const handleUnsubscribe = async () => null;

  const onSubscribe = () => {
    setIsLoading(true);
    handleSubscribe().then(() => {
      setIsSubscribed(true);
      setIsLoading(false);
    });
    return null;
  };

  const onUnsubscribe = () => {
    setIsLoading(true);
    handleUnsubscribe().then(() => {
      setIsSubscribed(false);
      setIsLoading(false);
    });
    return null;
  };

  return (
    <SubscribeButton
      disabled={loadingUser || !user}
      isLoading={isLoading}
      isSubscribed={isSubscribed}
      onSubscribe={onSubscribe}
      onCancelSubscription={onUnsubscribe}
    />
  );
};

export default SubscribeWebinar;

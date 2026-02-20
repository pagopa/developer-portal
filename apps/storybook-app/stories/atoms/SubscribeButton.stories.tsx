import React from 'react';
import { Meta, StoryObj } from '@storybook/nextjs';
import SubscribeButton from '../../../nextjs-website/src/components/atoms/SubscribeButton/SubscribeButton';

const meta: Meta<typeof SubscribeButton> = {
  title: 'Atoms/SubscribeButton',
  component: SubscribeButton,
};

export default meta;

export const Showcase: StoryObj<typeof SubscribeButton> = {
  args: {
    isLoading: false,
    onCancelSubscription: () => null,
    onSubscribe: () => null,
  },
  render: (props) => <SubscribeButton {...props} />,
};

export const LoadingShowcase: StoryObj<typeof SubscribeButton> = {
  args: {
    isLoading: true,
    onCancelSubscription: () => null,
    onSubscribe: () => null,
  },
  render: (props) => <SubscribeButton {...props} />,
};

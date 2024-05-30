import React from "react";
import { Meta, StoryObj } from "@storybook/react";
import { NextIntlProvider } from "next-intl";
import SubscribeButton from "../../../nextjs-website/src/components/atoms/SubscribeButton/SubscribeButton";

const meta: Meta<typeof SubscribeButton> = {
  title: "Atoms/SubscribeButton",
  component: SubscribeButton,
};

export default meta;

export const Showcase: StoryObj<typeof SubscribeButton> = {
  args: {
    isLoading: false,
    onCancelSubscription: () => null,
    onSubscribe: () => null,
  },
  render: (props) => (
    <NextIntlProvider messages={{}} locale="it">
      <SubscribeButton {...props} />
    </NextIntlProvider>
  ),
};

export const LoadingShowcase: StoryObj<typeof SubscribeButton> = {
  args: {
    isLoading: true,
    onCancelSubscription: () => null,
    onSubscribe: () => null,
  },
  render: (props) => (
    <NextIntlProvider messages={{}} locale="it">
      <SubscribeButton {...props} />
    </NextIntlProvider>
  ),
};

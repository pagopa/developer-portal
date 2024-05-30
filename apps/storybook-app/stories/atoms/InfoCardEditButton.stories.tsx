import React from "react";
import { Meta, StoryObj } from "@storybook/react";
import { NextIntlClientProvider } from "next-intl";
import InfoCardEditButton from "../../../nextjs-website/src/components/atoms/InfoCardEditButton/InfoCardEditButton";

const meta: Meta<typeof InfoCardEditButton> = {
  title: "Atoms/InfoCardEditButton",
  component: InfoCardEditButton,
};

export default meta;

export const Showcase: StoryObj<typeof InfoCardEditButton> = {
  args: {},
  render: (props) => (
    <NextIntlClientProvider locale="it" messages={{}}>
      <InfoCardEditButton {...props} />
    </NextIntlClientProvider>
  ),
};

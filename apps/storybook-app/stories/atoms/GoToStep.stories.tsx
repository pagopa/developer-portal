import React from "react";
import { Meta, StoryObj } from "@storybook/react";
import GoToStep from "../../../nextjs-website/src/components/atoms/GoToStep/GoToStep";
import { NextIntlClientProvider } from "next-intl";

const meta: Meta<typeof GoToStep> = {
  title: "Atoms/GoToStep",
  component: GoToStep,
};

export default meta;

export const PreviousShowcase: StoryObj<typeof GoToStep> = {
  args: {
    previousOrNext: "previous",
    title: "Previous",
  },
  render: (args) => {
    return (
      <NextIntlClientProvider locale="it" messages={{}}>
        <GoToStep {...args} />
      </NextIntlClientProvider>
    );
  },
};

export const NextShowcase: StoryObj<typeof GoToStep> = {
  args: {
    previousOrNext: "next",
    title: "Next",
  },
  render: (args) => {
    return (
      <NextIntlClientProvider locale="it" messages={{}}>
        <GoToStep {...args} />
      </NextIntlClientProvider>
    );
  },
};

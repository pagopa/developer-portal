import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { NextIntlClientProvider } from 'next-intl';
import { InfoCardItemProfile } from 'nextjs-website/src/components/atoms/InfoCardItem/InfoCardItemProfile';

const meta: Meta<typeof InfoCardItemProfile> = {
  title: 'Atoms/InfoCardItemProfile',
  component: InfoCardItemProfile,
};

export default meta;

export const Showcase: StoryObj<typeof InfoCardItemProfile> = {
  args: {
    title: 'This is the title',
    editable: true,
    required: true,
    editing: false,
    onInsertPressed: () => null,
  },
  render: (props) => (
    <NextIntlClientProvider locale='it' messages={{}}>
      <InfoCardItemProfile {...props} />
    </NextIntlClientProvider>
  ),
};

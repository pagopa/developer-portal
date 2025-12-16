import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { NextIntlClientProvider } from 'next-intl';
import { ProfileDataCardItem } from 'nextjs-website/src/components/atoms/InfoCardItem/ProfileDataCardItem';

const meta: Meta<typeof ProfileDataCardItem> = {
  title: 'Atoms/InfoCardItemProfile',
  component: ProfileDataCardItem,
};

export default meta;

export const Showcase: StoryObj<typeof ProfileDataCardItem> = {
  args: {
    title: 'This is the title',
    editable: true,
    required: true,
    editing: false,
    onInsertPressed: () => null,
  },
  render: (props) => (
    <NextIntlClientProvider locale='it' messages={{}}>
      <ProfileDataCardItem {...props} />
    </NextIntlClientProvider>
  ),
};

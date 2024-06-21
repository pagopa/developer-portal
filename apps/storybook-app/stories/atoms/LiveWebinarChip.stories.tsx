import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { NextIntlClientProvider } from 'next-intl';
import LiveWebinarChip from '../../../nextjs-website/src/components/atoms/LiveWebinarChip/LiveWebinarChip';

const meta: Meta<typeof LiveWebinarChip> = {
  title: 'Atoms/LiveWebinarChip',
  component: LiveWebinarChip,
};

export default meta;

export const Showcase: StoryObj<typeof LiveWebinarChip> = {
  args: {},
  render: () => (
    <NextIntlClientProvider locale='it' messages={{}}>
      <LiveWebinarChip />
    </NextIntlClientProvider>
  ),
};

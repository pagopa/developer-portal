import { Decorator, Meta, StoryObj } from '@storybook/nextjs';
import ChatbotChip from 'nextjs-website/src/components/atoms/ChatbotChip/ChatbotChip';
import { nextIntlContextDecorator } from '../next-intl-context.helper';
import React from 'react';

const meta: Meta<typeof ChatbotChip> = {
  title: 'Atoms/ChatbotChip',
  component: ChatbotChip,
};

export default meta;

const decorator: Decorator = (story) => (
  <div style={{ backgroundColor: '#FFFFFF', padding: '2rem' }}>{story()}</div>
);

export const Showcase: StoryObj<typeof ChatbotChip> = {
  args: {
    label: 'Storico pagamenti',
  },
  decorators: [decorator, nextIntlContextDecorator],
};

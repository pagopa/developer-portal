import { Decorator, Meta, StoryObj } from '@storybook/nextjs';
import ChatbotChip from 'nextjs-website/src/components/atoms/ChatbotChip/ChatbotChip';
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
    question: 'Visualizza lo storico dei pagamenti',
  },
  decorators: [decorator],
};

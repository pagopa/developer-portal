import { Decorator, Meta, StoryObj } from '@storybook/react';
import ChatMessage from '../../../nextjs-website/src/components/molecules/ChatMessage/ChatMessage';
import React from 'react';

const meta: Meta<typeof ChatMessage> = {
  title: 'Molecules/ChatMessage',
  component: ChatMessage,
};

const decorator: Decorator = (story) => (
  <div style={{ backgroundColor: '#D9D9D9', padding: '2rem' }}>
    {story()}
  </div>
);

export default meta;

export const Showcase: StoryObj<typeof ChatMessage> = {
  args: {
    message: 'Hello World',
    sender: 'John Doe',
    timestamp: '11:22',
  },
  decorators: [decorator],
};

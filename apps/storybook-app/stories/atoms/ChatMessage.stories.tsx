import { Decorator, Meta, StoryObj } from '@storybook/react';
import ChatMessage from '../../../nextjs-website/src/components/atoms/ChatMessage/ChatMessage';
import React from 'react';
import { nextIntlContextDecorator } from '../next-intl-context.helper';
import { mockText } from '../mock-content.helper';

const meta: Meta<typeof ChatMessage> = {
  title: 'Atoms/ChatMessage',
  component: ChatMessage,
};

const decorator: Decorator = (story) => (
  <div style={{ backgroundColor: '#FFFFFF', padding: '2rem' }}>{story()}</div>
);

export default meta;

export const ChatBotMessage: StoryObj<typeof ChatMessage> = {
  args: {
    text: mockText(40),
    isQuestion: false,
    timestamp: '2024-07-24T17:14:07.129Z',
  },
  decorators: [decorator, nextIntlContextDecorator],
};

export const UserMessage: StoryObj<typeof ChatMessage> = {
  args: {
    text: mockText(23),
    isQuestion: true,
    timestamp: '2024-07-24T17:14:08.129Z',
  },
  decorators: [decorator, nextIntlContextDecorator],
};

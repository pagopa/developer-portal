import { Decorator, Meta, StoryObj } from '@storybook/react';
import Chat from '../../../nextjs-website/src/components/molecules/Chat/Chat';
import React from 'react';
import { nextIntlContextDecorator } from '../next-intl-context.helper';
import { mockText } from '../mock-content.helper';

const meta: Meta<typeof Chat> = {
  title: 'Molecules/Chat',
  component: Chat,
};

const decorator: Decorator = (story) => (
  <div style={{ backgroundColor: 'black' }}>{story()}</div>
);

export default meta;

export const Showcase: StoryObj<typeof Chat> = {
  args: {
    queries: [
      {
        sessionId: 'sessionID',
        answer: mockText(25),
        createdAt: '2024-07-24T17:14:07.129Z',
      },
      {
        sessionId: 'sessionID',
        question: mockText(10),
        queriedAt: '2024-07-24T17:14:07.129Z',
        answer: mockText(50),
        createdAt: '2024-07-24T17:14:07.129Z',
      },
      {
        sessionId: 'sessionID',
        question: mockText(12),
        queriedAt: '2024-07-24T17:14:07.129Z',
      },
    ],
    onSendQuery: (query: string) => {
      console.log(query);
      return null;
    },
    isAwaitingResponse: true,
  },
  decorators: [decorator, nextIntlContextDecorator],
};

export const QueryError: StoryObj<typeof Chat> = {
  args: {
    queries: [
      {
        sessionId: 'sessionID',
        question: mockText(12),
        queriedAt: '2024-07-24T17:14:07.129Z',
      },
    ],
    onSendQuery: (query: string) => {
      console.log(query);
      return null;
    },
    error: 'queryFailed',
  },
  decorators: [decorator, nextIntlContextDecorator],
};

export const ChatbotServiceError: StoryObj<typeof Chat> = {
  args: {
    queries: [
      {
        sessionId: 'sessionID',
        question: mockText(12),
        queriedAt: '2024-07-24T17:14:07.129Z',
      },
    ],
    onSendQuery: (query: string) => {
      console.log(query);
      return null;
    },
    error: 'serviceDown',
  },
  decorators: [decorator, nextIntlContextDecorator],
};

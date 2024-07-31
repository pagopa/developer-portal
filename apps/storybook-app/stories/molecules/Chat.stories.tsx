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
  <div style={{ backgroundColor: 'black', padding: '2rem' }}>{story()}</div>
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
        question: 'Accetto',
        queriedAt: '2024-07-24T17:14:07.129Z',
        answer: mockText(10),
        createdAt: '2024-07-24T17:14:07.129Z',
      },
      {
        sessionId: 'sessionID',
        question: mockText(50),
        queriedAt: '2024-07-24T17:14:07.129Z',
      },
    ],
    onSendQuery: (query: string) => {
      console.log(query);
      return null;
    },
  },
  decorators: [decorator, nextIntlContextDecorator],
};

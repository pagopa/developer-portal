import { Decorator, Meta, StoryObj } from '@storybook/nextjs';
import ChatbotLayout from 'nextjs-website/src/components/organisms/ChatbotLayout/ChatbotLayout';
import React from 'react';
import { mockText } from '../mock-content.helper';

const meta: Meta<typeof ChatbotLayout> = {
  title: 'Organisms/ChatbotLayout',
  component: ChatbotLayout,
};

const decorator: Decorator = (story) => (
  <div style={{ padding: '2rem' }}>
    <div style={{ position: 'fixed', bottom: '2rem', right: '2rem' }}>
      {story()}
    </div>
  </div>
);

export default meta;

export const NewChatSession: StoryObj<typeof ChatbotLayout> = {
  args: {
    areChatbotQueriesLoaded: true,
    queries: [
      {
        sessionId: 'sessionID',
        answer: mockText(25),
        createdAt: '2024-07-24T17:14:07.129Z',
      },
    ],
    onSendQuery: (query: string) => {
      console.log(query);
      return null;
    },
  },
  decorators: [decorator],
};

export const ChatSessionWithMessages: StoryObj<typeof ChatbotLayout> = {
  args: {
    areChatbotQueriesLoaded: true,
    queries: [
      {
        sessionId: 'sessionID',
        question: mockText(5),
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
    isAwaitingResponse: true,
  },
  decorators: [decorator],
};

export const LoadingChatSession: StoryObj<typeof ChatbotLayout> = {
  args: {
    areChatbotQueriesLoaded: false,
    queries: [],
    onSendQuery: (query: string) => {
      console.log(query);
      return null;
    },
  },
  decorators: [decorator],
};

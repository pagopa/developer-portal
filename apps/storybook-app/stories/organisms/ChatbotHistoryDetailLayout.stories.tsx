import { Decorator, Meta, StoryObj } from '@storybook/nextjs';
import ChatbotHistoryDetailLayout from 'nextjs-website/src/components/organisms/ChatbotHistoryDetailLayout/ChatbotHistoryDetailLayout';
import { chatbotChatSession } from '../fixtures/chatbotFixtures';
import React from 'react';
import { mockText } from '../mock-content.helper';

const meta: Meta<typeof ChatbotHistoryDetailLayout> = {
  title: 'Organisms/ChatbotHistoryDetailLayout',
  component: ChatbotHistoryDetailLayout,
};

const decorator: Decorator = (story) => (
  <div style={{ padding: '2rem' }}>{story()}</div>
);

export default meta;

export const Showcase: StoryObj<typeof ChatbotHistoryDetailLayout> = {
  args: {
    queries: chatbotChatSession,
    userName: 'John Doe',
    nextSession: {
      sessionId: '1',
      sessionTitle: mockText(10),
    },
    previousSession: {
      sessionId: '2',
      sessionTitle: mockText(5),
    },
    onDeleteChatSession: (sessionId: string) => {
      console.log(sessionId);
      return null;
    },
  },
  decorators: [decorator],
};

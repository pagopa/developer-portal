import { Decorator, Meta, StoryObj } from '@storybook/react';
import ChatbotHistoryLayout from 'nextjs-website/src/components/organisms/ChatbotHistoryLayout/ChatbotHistoryLayout';
import { sessionsList } from '../fixtures/chatbotFixture';
import React from 'react';

const meta: Meta<typeof ChatbotHistoryLayout> = {
  title: 'Organisms/ChatbotHistoryLayout',
  component: ChatbotHistoryLayout,
};

const decorator: Decorator = (story) => (
  <div style={{ padding: '2rem' }}>{story()}</div>
);

export default meta;

export const NewChatSession: StoryObj<typeof ChatbotHistoryLayout> = {
  args: {
    paginatedSessions: {
      items: sessionsList,
      page: 1,
      pages: 5,
      size: 44,
    },
    getSessionsByPage: (page: number) => {
      console.log(page);
      return null;
    },
  },
  decorators: [decorator],
};

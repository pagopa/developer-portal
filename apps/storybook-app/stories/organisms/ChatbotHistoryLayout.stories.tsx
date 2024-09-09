import { Meta, StoryObj } from '@storybook/react';
import ChatbotHistoryLayout from 'nextjs-website/src/components/organisms/ChatbotHistoryLayout/ChatbotHistoryLayout';
import { sessionsList } from '../fixtures/chatbotFixture';

const meta: Meta<typeof ChatbotHistoryLayout> = {
  title: 'Organisms/ChatbotHistoryLayout',
  component: ChatbotHistoryLayout,
};

export default meta;

export const NewChatSession: StoryObj<typeof ChatbotHistoryLayout> = {
  args: {
    paginatedSessions: {
      items: sessionsList,
      page: 1,
      pages: 5,
      size: 44,
    },
    getSessions: (page: number) => {
      console.log(page);
      return null;
    },
  },
};

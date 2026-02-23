import { Decorator, Meta, StoryObj } from '@storybook/nextjs';
import { Box } from '@mui/material';
import ChatbotHistoryLayout from 'nextjs-website/src/components/organisms/ChatbotHistoryLayout/ChatbotHistoryLayout';
import { sessionsList } from '../fixtures/chatbotFixtures';
import React from 'react';

const meta: Meta<typeof ChatbotHistoryLayout> = {
  title: 'Organisms/ChatbotHistoryLayout',
  component: ChatbotHistoryLayout,
};

const decorator: Decorator = (story) => (
  <Box sx={{ padding: { xs: 0, md: '2rem' } }}>{story()}</Box>
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

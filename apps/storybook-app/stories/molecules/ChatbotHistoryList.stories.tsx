import { Decorator, Meta, StoryObj } from '@storybook/nextjs';
import ChatbotHistoryList from '../../../nextjs-website/src/components/molecules/ChatbotHistoryList/ChatbotHistoryList';
import React from 'react';
import { sessionsList } from '../fixtures/chatbotFixtures';

const meta: Meta<typeof ChatbotHistoryList> = {
  title: 'Molecules/ChatbotHistoryList',
  component: ChatbotHistoryList,
};

const decorator: Decorator = (story) => (
  <div style={{ backgroundColor: 'white' }}>{story()}</div>
);

export default meta;

export const Showcase: StoryObj<typeof ChatbotHistoryList> = {
  args: {
    sessionsList: sessionsList,
  },
  decorators: [decorator],
};

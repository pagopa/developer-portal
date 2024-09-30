import { Decorator, Meta, StoryObj } from '@storybook/react';
import ChatbotHistoryList from '../../../nextjs-website/src/components/molecules/ChatbotHistoryList/ChatbotHistoryList';
import React from 'react';
import { nextIntlContextDecorator } from '../next-intl-context.helper';
import { sessionsList } from '../fixtures/chatbotFixture';

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
  decorators: [decorator, nextIntlContextDecorator],
};

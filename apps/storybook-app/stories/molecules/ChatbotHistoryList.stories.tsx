import { Decorator, Meta, StoryObj } from '@storybook/react';
import ChatbotHistoryList from '../../../nextjs-website/src/components/molecules/ChatbotHistoryList/ChatbotHistoryList';
import React from 'react';
import { nextIntlContextDecorator } from '../next-intl-context.helper';
import { mockText } from '../mock-content.helper';

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
    sessionsList: [
      {
        id: '111',
        title: mockText(25),
        createdAt: '2024-07-24T17:14:07.129Z',
      },
      {
        id: '123',
        title: mockText(25),
        createdAt: '2024-07-25T17:14:07.129Z',
      },
      {
        id: '456',
        title: mockText(80),
        createdAt: '2024-07-26T17:14:07.129Z',
      },
      {
        id: '789',
        title: mockText(25),
        createdAt: '2024-06-24T17:14:07.129Z',
      },
      {
        id: '321',
        title: mockText(25),
        createdAt: '2024-06-25T17:14:07.129Z',
      },
      {
        id: '654',
        title: mockText(80),
        createdAt: '2024-06-26T17:14:07.129Z',
      },
      {
        id: '987',
        title: mockText(25),
        createdAt: '2024-04-24T17:14:07.129Z',
      },
      {
        id: '543',
        title: mockText(25),
        createdAt: '2024-04-25T17:14:07.129Z',
      },
      {
        id: '333',
        title: mockText(80),
        createdAt: '2024-04-26T17:14:07.129Z',
      },
      {
        id: '1221',
        title: mockText(25),
        createdAt: '2024-03-24T17:14:07.129Z',
      },
      {
        id: '2352',
        title: mockText(25),
        createdAt: '2024-03-25T17:14:07.129Z',
      },
      {
        id: '45664',
        title: mockText(80),
        createdAt: '2024-03-26T17:14:07.129Z',
      },
    ],
  },
  decorators: [decorator, nextIntlContextDecorator],
};

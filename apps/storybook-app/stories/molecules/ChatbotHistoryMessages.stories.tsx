import { Decorator, Meta, StoryObj } from '@storybook/nextjs';
import ChatbotHistoryMessages from '../../../nextjs-website/src/components/molecules/ChatbotHistoryMessages/ChatbotHistoryMessages';
import React from 'react';
import { mockText } from '../mock-content.helper';

const meta: Meta<typeof ChatbotHistoryMessages> = {
  title: 'Molecules/ChatbotHistoryMessages',
  component: ChatbotHistoryMessages,
};

const decorator: Decorator = (story) => (
  <div style={{ backgroundColor: 'white', padding: '2rem' }}>{story()}</div>
);

export default meta;

export const Showcase: StoryObj<typeof ChatbotHistoryMessages> = {
  args: {
    queries: [
      {
        id: '1',
        sessionId: '1',
        question: mockText(10),
        queriedAt: '2024-07-24T17:14:07.129Z',
        answer: mockText(80),
        createdAt: '2024-07-24T17:14:07.129Z',
      },
      {
        id: '2',
        sessionId: '1',
        question: mockText(8),
        queriedAt: '2024-07-24T17:14:07.129Z',
        answer: mockText(30),
        createdAt: '2024-07-24T17:14:07.129Z',
      },
      {
        id: '3',
        sessionId: '1',
        question: mockText(50),
        queriedAt: '2024-07-24T17:14:07.129Z',
      },
    ],
    userName: 'John Doe',
  },
  decorators: [decorator],
};

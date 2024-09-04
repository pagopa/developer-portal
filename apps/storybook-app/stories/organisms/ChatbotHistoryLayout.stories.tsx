import { Meta, StoryObj } from '@storybook/react';
import ChatbotHistoryLayout from 'nextjs-website/src/components/organisms/ChatbotHistoryLayout/ChatbotHistoryLayout';
import { mockText } from '../mock-content.helper';

const meta: Meta<typeof ChatbotHistoryLayout> = {
  title: 'Organisms/ChatbotHistoryLayout',
  component: ChatbotHistoryLayout,
};

export default meta;

export const NewChatSession: StoryObj<typeof ChatbotHistoryLayout> = {
  args: {
    paginatedSessions: {
      items: [
        {
          title: mockText(25),
          id: '111',
          createdAt: '2024-07-24T17:14:07.129Z',
        },
        {
          title: mockText(25),
          id: '112',
          createdAt: '2024-07-23T17:14:07.129Z',
        },
        {
          title: mockText(25),
          id: '113',
          createdAt: '2024-07-22T17:14:07.129Z',
        },
        {
          title: mockText(25),
          id: '114',
          createdAt: '2024-07-21T17:14:07.129Z',
        },
        {
          title: mockText(25),
          id: '115',
          createdAt: '2024-06-24T17:14:07.129Z',
        },
        {
          title: mockText(25),
          id: '116',
          createdAt: '2024-06-23T17:14:07.129Z',
        },
        {
          title: mockText(25),
          id: '117',
          createdAt: '2024-06-22T17:14:07.129Z',
        },
        {
          title: mockText(25),
          id: '118',
          createdAt: '2024-06-21T17:14:07.129Z',
        },
        {
          title: mockText(25),
          id: '119',
          createdAt: '2024-06-20T17:14:07.129Z',
        },
        {
          title: mockText(25),
          id: '120',
          createdAt: '2024-05-24T17:14:07.129Z',
        },
      ],
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

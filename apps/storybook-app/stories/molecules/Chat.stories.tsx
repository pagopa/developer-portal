import { Decorator, Meta, StoryObj } from '@storybook/nextjs';
import Chat from '../../../nextjs-website/src/components/molecules/Chat/Chat';
import React from 'react';
import { mockText } from '../mock-content.helper';
import { authProviderDecorator } from '../auth-provider.helper';

const meta: Meta<typeof Chat> = {
  title: 'Molecules/Chat',
  component: Chat,
};

const decorator: Decorator = (story) => (
  <div style={{ backgroundColor: 'black' }}>{story()}</div>
);

export default meta;

export const Showcase: StoryObj<typeof Chat> = {
  args: {
    queries: [
      {
        sessionId: 'sessionID',
        answer: mockText(25),
        createdAt: '2024-07-24T17:14:07.129Z',
      },
      {
        sessionId: 'sessionID',
        question: mockText(10),
        queriedAt: '2024-07-24T17:14:07.129Z',
        answer: mockText(50),
        createdAt: '2024-07-24T17:14:07.129Z',
      },
      {
        sessionId: 'sessionID',
        question: mockText(12),
        queriedAt: '2024-07-24T17:14:07.129Z',
      },
    ],
    onSendQuery: (query: string) => {
      console.log(query);
      return null;
    },
    isAwaitingResponse: true,
  },
  decorators: [decorator, authProviderDecorator],
};

export const QueryWithChips: StoryObj<typeof Chat> = {
  args: {
    queries: [
      {
        sessionId: 'sessionID',
        question: mockText(12),
        queriedAt: '2024-07-24T17:14:07.129Z',
        chips: [
          {
            label: 'Documentazione API',
            question: 'Mostrami la documentazione API',
            knowledgeBase: 'api-docs',
          },
          {
            label: "Calcolare l'importo dovuto",
            question: "Come posso calcolare l'importo dovuto?",
            knowledgeBase: 'payment-calculation',
          },
          {
            label: 'Verificare la regolarità dei pagamenti',
            question: 'Come posso verificare la regolarità dei pagamenti?',
            knowledgeBase: 'payment-verification',
          },
          {
            label: 'Ottenere un rimborso',
            question: 'Come posso ottenere un rimborso?',
            knowledgeBase: 'refund',
          },
          {
            label: 'Richiedere assistenza',
            knowledgeBase: 'support',
          },
          {
            label: 'Visualizzare lo storico pagamenti',
            knowledgeBase: 'payment-history',
          },
          {
            label: 'Scaricare ricevute',
            knowledgeBase: 'receipt-download',
          },
        ],
      },
    ],
    onSendQuery: (query: string) => {
      console.log(query);
      return null;
    },
  },
  decorators: [decorator, authProviderDecorator],
};

export const QueryError: StoryObj<typeof Chat> = {
  args: {
    queries: [
      {
        sessionId: 'sessionID',
        question: mockText(12),
        queriedAt: '2024-07-24T17:14:07.129Z',
      },
    ],
    onSendQuery: (query: string) => {
      console.log(query);
      return null;
    },
    error: 'queryFailed',
  },
  decorators: [decorator, authProviderDecorator],
};

export const ChatbotServiceError: StoryObj<typeof Chat> = {
  args: {
    queries: [
      {
        sessionId: 'sessionID',
        question: mockText(12),
        queriedAt: '2024-07-24T17:14:07.129Z',
      },
    ],
    onSendQuery: (query: string) => {
      console.log(query);
      return null;
    },
    error: 'serviceDown',
  },
  decorators: [decorator, authProviderDecorator],
};

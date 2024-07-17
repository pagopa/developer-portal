import { Decorator, Meta, StoryObj } from '@storybook/react';
import ChatbotLayout from 'nextjs-website/src/components/organisms/ChatbotLayout/ChatbotLayout';
import React from 'react';

const meta: Meta<typeof ChatbotLayout> = {
  title: 'Organisms/ChatbotLayout',
  component: ChatbotLayout,
};

const decorator: Decorator = (story) => (
  <div style={{ padding: '2rem' }}>
    <div style={{ position: 'fixed', bottom: '2rem', right: '2rem' }}>
      {story()}
    </div>
  </div>
);

export default meta;

export const NewChatSession: StoryObj<typeof ChatbotLayout> = {
  args: {
    queries: [
      {
        sessionId: 'sessionID',
        answer:
          "Ciao, sono [Nome Chatbot], il chatbot di DevPortal.\nPrima di incominciare ti invito a leggere l'Informativa sulla Privacy.\nScrivi Accetto per proseguire.",
        createdAt: '11:21',
      },
    ],
    onSendQuery: (query: string) => {
      console.log(query);
      return null;
    },
  },
  decorators: [decorator],
};

export const ChatSessionWithMessages: StoryObj<typeof ChatbotLayout> = {
  args: {
    queries: [
      {
        sessionId: 'sessionID',
        answer:
          "Ciao, sono [Nome Chatbot], il chatbot di DevPortal.\nPrima di incominciare ti invito a leggere l'Informativa sulla Privacy.\nScrivi Accetto per proseguire.",
        createdAt: '11:21',
      },
      {
        sessionId: 'sessionID',
        question: 'Accetto',
        queriedAt: '11:22',
        answer: 'Ottimo! Adesso possiamo incominciare. Come posso aiutarti?',
        createdAt: '11:22',
      },
      {
        sessionId: 'sessionID',
        question:
          "E' possibile pagare una posizione debitoria una volta scaduta?",
        queriedAt: '11:22',
      },
    ],
    onSendQuery: (query: string) => {
      console.log(query);
      return null;
    },
  },
  decorators: [decorator],
};

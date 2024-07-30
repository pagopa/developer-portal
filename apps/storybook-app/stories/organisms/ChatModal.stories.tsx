import { Decorator, Meta, StoryObj } from '@storybook/react';
import ChatModal from '../../../nextjs-website/src/components/organisms/ChatModal/ChatModal';
import React from 'react';
import { nextIntlContextDecorator } from '../next-intl-context.helper';

const meta: Meta<typeof ChatModal> = {
  title: 'Organisms/ChatModal',
  component: ChatModal,
};

const decorator: Decorator = (story) => (
  <div style={{ padding: '2rem' }}>
    <div style={{ position: 'fixed', bottom: '2rem', right: '2rem' }}>
      {story()}
    </div>
  </div>
);

export default meta;

export const NewChatSession: StoryObj<typeof ChatModal> = {
  args: {
    chatMessages: [
      {
        message:
          "Ciao, sono [Nome Chatbot], il chatbot di DevPortal.\nPrima di incominciare ti invito a leggere l'Informativa sulla Privacy.\nScrivi Accetto per proseguire.",
        timestamp: '11:21',
      },
    ],
  },
  decorators: [decorator, nextIntlContextDecorator],
};

export const ChatSessionWithMessages: StoryObj<typeof ChatModal> = {
  args: {
    chatMessages: [
      {
        message:
          "Ciao, sono [Nome Chatbot], il chatbot di DevPortal.\nPrima di incominciare ti invito a leggere l'Informativa sulla Privacy.\nScrivi Accetto per proseguire.",
        timestamp: '11:21',
      },
      {
        message: 'Accetto',
        sender: 'Mario Rossi',
        timestamp: '11:22',
      },
      {
        message: 'Ottimo! Adesso possiamo incominciare. Come posso aiutarti?',
        timestamp: '11:22',
      },
      {
        message:
          "E' possibile pagare una posizione debitoria una volta scaduta?",
        sender: 'Mario Rossi',
        timestamp: '11:22',
      },
    ],
  },
  decorators: [decorator, nextIntlContextDecorator],
};

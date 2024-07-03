import { Decorator, Meta, StoryObj } from '@storybook/react';
import Chat from '../../../nextjs-website/src/components/molecules/Chat/Chat';
import React from 'react';

const meta: Meta<typeof Chat> = {
  title: 'Molecules/Chat',
  component: Chat,
};

const decorator: Decorator = (story) => (
  <div style={{ backgroundColor: 'black', padding: '2rem' }}>
    {story()}
  </div>
);

export default meta;

export const Showcase: StoryObj<typeof Chat> = {
  args: {
    chatMessages: [
      {
        message: "Ciao, sono [Nome Chatbot], il chatbot di DevPortal.\nPrima di incominciare ti invito a leggere l'Informativa sulla Privacy.\nScrivi Accetto per proseguire.",
        timestamp: '11:21'
      },
      {
        message: 'Accetto', 
        sender: 'Mario Rossi', 
        timestamp: '11:22'
      },
      {
        message: "Ottimo! Adesso possiamo incominciare. Come posso aiutarti?",
        timestamp: '11:22'
      },
      {
        message: "E' possibile pagare una posizione debitoria una volta scaduta?",
        sender: 'Mario Rossi',
        timestamp: '11:22'
      }
    ]
  },
  decorators: [decorator],
};

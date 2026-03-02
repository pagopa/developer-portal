import { Decorator, Meta, StoryObj } from '@storybook/nextjs';
import ChatbotChipsContainer from 'nextjs-website/src/components/molecules/ChatbotChipsContainer/ChatbotChipsContainer';
import React from 'react';

const meta: Meta<typeof ChatbotChipsContainer> = {
  title: 'Molecules/ChatbotChipsContainer',
  component: ChatbotChipsContainer,
};

export default meta;

const decorator: Decorator = (story) => (
  <div style={{ backgroundColor: '#FFFFFF', padding: '2rem' }}>{story()}</div>
);

export const Showcase: StoryObj<typeof ChatbotChipsContainer> = {
  args: {
    chips: [
      {
        label: 'Documentazione API',
        question: 'Mostrami la documentazione API',
      },
      {
        label: "Calcolare l'importo dovuto",
        question: "Come posso calcolare l'importo dovuto?",
      },
      {
        label: 'Verificare la regolarità dei pagamenti',
        question: 'Come posso verificare la regolarità dei pagamenti?',
      },
      {
        label: 'Ottenere un rimborso',
        question: 'Come posso ottenere un rimborso?',
      },
      {
        label: 'Richiedere assistenza',
        question: 'Come posso richiedere assistenza?',
      },
      {
        label: 'Visualizzare lo storico pagamenti',
        question: 'Come posso visualizzare lo storico dei pagamenti?',
      },
      {
        label: 'Scaricare ricevute',
        question: 'Come posso scaricare le ricevute?',
      },
    ],
  },
  decorators: [decorator],
};

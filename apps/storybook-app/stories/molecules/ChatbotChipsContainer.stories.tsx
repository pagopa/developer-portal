import { Decorator, Meta, StoryObj } from '@storybook/nextjs';
import ChatbotChipsContainer from 'nextjs-website/src/components/molecules/ChatbotChipsContainer/ChatbotChipsContainer';
import { nextIntlContextDecorator } from '../next-intl-context.helper';
import React from 'react';

const meta: Meta<typeof ChatbotChipsContainer> = {
  title: 'Atoms/ChatbotChipContainer',
  component: ChatbotChipsContainer,
};

export default meta;

const decorator: Decorator = (story) => (
  <div style={{ backgroundColor: '#FFFFFF', padding: '2rem' }}>{story()}</div>
);

export const Showcase: StoryObj<typeof ChatbotChipsContainer> = {
  args: {
    chips: [
      { label: 'Documentazione API' },
      { label: "Calcolare l'importo dovuto" },
      { label: 'Verificare la regolarità dei pagamenti' },
      { label: 'Ottenere un rimborso' },
      { label: 'Richiedere assistenza' },
      { label: 'Visualizzare lo storico pagamenti' },
      { label: 'Scaricare ricevute' },
    ],
  },
  decorators: [decorator, nextIntlContextDecorator],
};

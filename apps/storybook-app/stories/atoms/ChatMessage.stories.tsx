import { Decorator, Meta, StoryObj } from '@storybook/react';
import ChatMessage from '../../../nextjs-website/src/components/atoms/ChatMessage/ChatMessage';
import React from 'react';
import { nextIntlContextDecorator } from '../next-intl-context.helper';
import { mockText } from '../mock-content.helper';

const meta: Meta<typeof ChatMessage> = {
  title: 'Atoms/ChatMessage',
  component: ChatMessage,
};

const decorator: Decorator = (story) => (
  <div style={{ backgroundColor: '#FFFFFF', padding: '2rem' }}>{story()}</div>
);

export default meta;

export const ChatBotMessage: StoryObj<typeof ChatMessage> = {
  args: {
    text: `
      GPD gestisce i pagamenti spontanei attraverso il nodo dei pagamenti.  
        
      Rif:  
      [PagoPA DevPortal | Overview delle componenti](https://docs.pagopa.it/io-guida-tecnica-1.3/)
    `,
    isQuestion: false,
    timestamp: '2024-07-24T17:14:07.129Z',
    dateHeader: 'Oggi',
    urlReplaceMap: {
      'https://docs.pagopa.it/io-guida-tecnica-1.3/': 'https://www.google.com',
    },
  },
  decorators: [decorator, nextIntlContextDecorator],
};

export const UserMessage: StoryObj<typeof ChatMessage> = {
  args: {
    text: mockText(23),
    isQuestion: true,
    timestamp: '2024-07-24T17:14:08.129Z',
    dateHeader: 'Oggi',
  },
  decorators: [decorator, nextIntlContextDecorator],
};

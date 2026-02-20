import { Decorator, Meta, StoryObj } from '@storybook/nextjs';
import ChatMessage from '../../../nextjs-website/src/components/atoms/ChatMessage/ChatMessage';
import React from 'react';
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
      [PagoPA DevPortal | Overview delle componenti](https://developer.pagopa.it/pago-pa/guides/sanp/specifiche-attuative-del-nodo-dei-pagamenti-spc/funzionamento-generale/overview-delle-componenti)
    `,
    isQuestion: false,
    timestamp: '2024-07-24T17:14:07.129Z',
    dateHeader: 'Oggi',
  },
  decorators: [decorator],
};

export const UserMessage: StoryObj<typeof ChatMessage> = {
  args: {
    text: mockText(23),
    isQuestion: true,
    timestamp: '2024-07-24T17:14:08.129Z',
    dateHeader: 'Oggi',
  },
  decorators: [decorator],
};

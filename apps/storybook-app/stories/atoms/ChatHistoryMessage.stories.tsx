import { Decorator, Meta, StoryObj } from '@storybook/nextjs';
import ChatHistoryMessage from 'nextjs-website/src/components/atoms/ChatHistoryMessage/ChatHistoryMessage';
import React from 'react';
import { mockText } from '../mock-content.helper';

const meta: Meta<typeof ChatHistoryMessage> = {
  title: 'Atoms/ChatHistoryMessage',
  component: ChatHistoryMessage,
};

const decorator: Decorator = (story) => (
  <div style={{ backgroundColor: '#FFFFFF', padding: '2rem' }}>{story()}</div>
);

export default meta;

export const ChatBotMessage: StoryObj<typeof ChatHistoryMessage> = {
  args: {
    text: `
      GPD gestisce i pagamenti spontanei attraverso il nodo dei pagamenti.  
        
      Rif:  
      [PagoPA DevPortal | Overview delle componenti](https://developer.pagopa.it/pago-pa/guides/sanp/specifiche-attuative-del-nodo-dei-pagamenti-spc/funzionamento-generale/overview-delle-componenti)
    `,
    timestamp: '2024-07-24T17:14:07.129Z',
    sender: 'Discovery',
    isQuestion: false,
  },
  decorators: [decorator],
};

export const UserMessage: StoryObj<typeof ChatHistoryMessage> = {
  args: {
    text: mockText(23),
    timestamp: '2024-07-24T17:14:08.129Z',
    sender: 'John Doe',
    isQuestion: true,
  },
  decorators: [decorator],
};

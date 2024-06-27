import { Decorator, Meta, StoryObj } from '@storybook/react';
import ChatInputText from '../../../nextjs-website/src/components/atoms/ChatInputText/ChatInputText';
import React from 'react';

const meta: Meta<typeof ChatInputText> = {
  title: 'Atoms/ChatInputText',
  component: ChatInputText,
};

const decorator: Decorator = (story) => (
  <div style={{ backgroundColor: '#D9D9D9', padding: '2rem' }}>
    {story()}
  </div>
);

export default meta;

export const Showcase: StoryObj<typeof ChatInputText> = {
  args: {
    onSubmit: (message: string) => {console.log(message); return null;},
  },
  decorators: [decorator],
};

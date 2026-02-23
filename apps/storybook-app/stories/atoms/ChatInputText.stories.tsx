import { Meta, StoryObj } from '@storybook/nextjs';
import ChatInputText from '../../../nextjs-website/src/components/atoms/ChatInputText/ChatInputText';

const meta: Meta<typeof ChatInputText> = {
  title: 'Atoms/ChatInputText',
  component: ChatInputText,
};

export default meta;

export const Showcase: StoryObj<typeof ChatInputText> = {
  args: {
    onSubmit: (message: string) => {
      console.log(message);
      return null;
    },
  },
};

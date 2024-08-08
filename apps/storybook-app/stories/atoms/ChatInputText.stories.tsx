import { Meta, StoryObj } from '@storybook/react';
import ChatInputText from '../../../nextjs-website/src/components/atoms/ChatInputText/ChatInputText';
import { nextIntlContextDecorator } from '../next-intl-context.helper';

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
  decorators: [nextIntlContextDecorator],
};

import { Meta, StoryObj } from "@storybook/react";
import ChatButton from '../../../nextjs-website/src/components/molecules/ChatButton/ChatButton';

const meta: Meta<typeof ChatButton> = {
  title: 'Atoms/ChatButton',
  component: ChatButton,
};

export default meta;

export const Showcase: StoryObj<typeof ChatButton> = {
  args: {
    label: 'ChatBot',
    onOpenChat: () => null,
  },
};

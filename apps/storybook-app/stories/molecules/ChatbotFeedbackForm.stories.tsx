import { Meta, StoryObj } from '@storybook/react';
import ChatbotFeedbackForm from 'nextjs-website/src/components/molecules/ChatbotFeedbackForm/ChatbotFeedbackForm';
import { nextIntlContextDecorator } from '../next-intl-context.helper';

const meta: Meta<typeof ChatbotFeedbackForm> = {
  title: 'Molecules/ChatbotFeedbackForm',
  component: ChatbotFeedbackForm,
};

export default meta;

export const Showcase: StoryObj<typeof ChatbotFeedbackForm> = {
  args: {
    disabled: false,
  },
  decorators: [nextIntlContextDecorator],
};

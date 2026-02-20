import { Meta, StoryObj } from '@storybook/nextjs';
import ChatbotFeedbackForm from 'nextjs-website/src/components/molecules/ChatbotFeedbackForm/ChatbotFeedbackForm';

const meta: Meta<typeof ChatbotFeedbackForm> = {
  title: 'Molecules/ChatbotFeedbackForm',
  component: ChatbotFeedbackForm,
};

export default meta;

export const Showcase: StoryObj<typeof ChatbotFeedbackForm> = {
  args: {
    sessionId: '',
    id: '',
  },
};

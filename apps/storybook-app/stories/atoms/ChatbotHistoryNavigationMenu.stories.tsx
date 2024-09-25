import { Meta, StoryObj } from '@storybook/react';
import ChatbotHistoryNavigationMenu from '../../../nextjs-website/src/components/atoms/ChatbotHistoryNavigationMenu/ChatbotHistoryNavigationMenu';
import { mockText } from '../mock-content.helper';
import { nextIntlContextDecorator } from '../next-intl-context.helper';

const meta: Meta<typeof ChatbotHistoryNavigationMenu> = {
  title: 'Atoms/ChatbotHistoryNavigationMenu',
  component: ChatbotHistoryNavigationMenu,
};

export default meta;

export const Showcase: StoryObj<typeof ChatbotHistoryNavigationMenu> = {
  args: {
    nextSession: {
      sessionId: '1',
      sessionTitle: mockText(10),
    },
    previousSession: {
      sessionId: '2',
      sessionTitle: mockText(5),
    },
  },
  decorators: [nextIntlContextDecorator],
};

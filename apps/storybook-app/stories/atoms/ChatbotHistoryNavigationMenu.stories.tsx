import { Meta, StoryObj } from '@storybook/nextjs';
import ChatbotHistoryNavigationMenu from '../../../nextjs-website/src/components/atoms/ChatbotHistoryNavigationMenu/ChatbotHistoryNavigationMenu';
import { mockText } from '../mock-content.helper';
import { nextIntlContextDecorator } from '../next-intl-context.helper';
import { withMockedParams } from '../../.storybook/mock-next-navigation';

const meta: Meta<typeof ChatbotHistoryNavigationMenu> = {
  title: 'Atoms/ChatbotHistoryNavigationMenu',
  component: ChatbotHistoryNavigationMenu,
};

export default meta;

type StoryProps = React.ComponentProps<typeof ChatbotHistoryNavigationMenu> & {
  locale: string;
};

export const Showcase: StoryObj<StoryProps> = {
  argTypes: {
    locale: {
      control: 'select',
      options: ['it', 'en'],
      description: 'Locale for internationalization',
      table: {
        category: 'Story',
        defaultValue: { summary: 'it' },
      },
      type: { name: 'string', required: false },
    },
  },
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
  decorators: [
    nextIntlContextDecorator,
    (Story, context) => withMockedParams(context.args.locale)(Story),
  ],
};

import { Meta, StoryObj } from '@storybook/react';
import TutorialTemplate from 'nextjs-website/src/components/templates/TutorialTemplate/TutorialTemplate';
import { mockImageBlock, mockTextBlock } from '../mock-content.helper';
import { nextIntlContextDecorator } from '../next-intl-context.helper';
import { appIo } from 'nextjs-website/src/_contents/appIo/appIo';

const meta: Meta<typeof TutorialTemplate> = {
  title: 'Templates/TutorialPageTemplate',
  component: TutorialTemplate,
};

export default meta;

export const Showcase: StoryObj<typeof TutorialTemplate> = {
  args: {
    title: 'Tutorial',
    path: 'tutorial',
    bannerLinks: [],
    relatedLinks: {
      title: 'Link correlati',
      links: [
        {
          text: 'Link 1',
          href: 'https://developer.pagopa.it',
        },
        {
          text: 'Link 2',
          href: 'https://developer.pagopa.it',
        },
      ],
    },
    parts: [
      {
        ...mockTextBlock({
          type: 'heading',
          level: 2,
          text: 'Sottotitolo',
        }),
      },
      { ...mockTextBlock() },
      { ...mockTextBlock() },
      { ...mockImageBlock() },
      {
        ...mockTextBlock({
          type: 'heading',
          level: 2,
          text: 'Sottotitolo',
        }),
      },
      { ...mockTextBlock() },
    ],
    product: appIo,
  },
  decorators: [nextIntlContextDecorator],
};

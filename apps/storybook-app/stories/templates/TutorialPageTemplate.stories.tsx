import { Meta, StoryObj } from '@storybook/react';
import TutorialPageTemplate from '../../../nextjs-website/src/components/templates/TutorialPageTemplate/TutorialPageTemplate';
import { mockImageBlock, mockTextBlock } from '../mock-content.helper';
import { nextIntlContextDecorator } from '../next-intl-context.helper';
import { appIo } from '../../../nextjs-website/src/_contents/appIo/appIo';

const meta: Meta<typeof TutorialPageTemplate> = {
  title: 'Templates/TutorialPageTemplate',
  component: TutorialPageTemplate,
};

export default meta;

export const Showcase: StoryObj<typeof TutorialPageTemplate> = {
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
    content: [
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

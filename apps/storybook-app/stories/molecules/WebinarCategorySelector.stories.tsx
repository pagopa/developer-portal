import { Meta, StoryObj } from '@storybook/react';
import WebinarCategorySelector from 'nextjs-website/src/components/molecules/WebinarCategorySelector/WebinarCategorySelector';
import { nextIntlContextDecorator } from '../next-intl-context.helper';

const meta: Meta<typeof WebinarCategorySelector> = {
  title: 'Molecules/WebinarCategorySelector',
  component: WebinarCategorySelector,
};

export default meta;

export const Showcase: StoryObj<typeof WebinarCategorySelector> = {
  args: {
    selectedWebinarCategory: 0,
    webinarCategories: [
      {
        name: 'miao',
        icon: {
          data: {
            attributes: {
              name: 'headset.svg',
              alternativeText: null,
              caption: null,
              width: 60,
              height: 61,
              size: 0.54,
              ext: '.svg',
              mime: 'image/svg+xml',
              url: '/icons/headset.svg',
            },
          },
        },
      },
      {
        name: 'bau',
        icon: {
          data: {
            attributes: {
              name: 'headset.svg',
              alternativeText: null,
              caption: null,
              width: 60,
              height: 61,
              size: 0.54,
              ext: '.svg',
              mime: 'image/svg+xml',
              url: '/icons/headset.svg',
            },
          },
        },
      },
    ],
  },
  decorators: [nextIntlContextDecorator],
};

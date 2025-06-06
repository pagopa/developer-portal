import { Meta, StoryObj } from '@storybook/react';
import MobileWebinarCategorySelector from 'nextjs-website/src/components/molecules/MobileWebinarCategorySelector/MobileWebinarCategorySelector';
import { nextIntlContextDecorator } from '../next-intl-context.helper';
const meta: Meta<typeof MobileWebinarCategorySelector> = {
  title: 'Molecules/MobileWebinarCategorySelector',
  component: MobileWebinarCategorySelector,
};

export default meta;

export const Showcase: StoryObj<typeof MobileWebinarCategorySelector> = {
  args: {
    selectedWebinarCategory: 0,
    webinarCategories: [
      {
        name: 'Tutti',
        icon: {
          data: {
            attributes: {
              name: 'all.svg',
              alternativeText: null,
              caption: null,
              color: 'blue',
              width: 60,
              height: 61,
              size: 0.54,
              ext: '.svg',
              mime: 'image/svg+xml',
              url: 'icons/all.svg',
            },
          },
        },
      },
      {
        name: 'Devtalks',
        icon: {
          data: {
            attributes: {
              name: 'devtalks.svg',
              alternativeText: null,
              caption: null,
              color: 'blue',
              width: 60,
              height: 61,
              size: 0.54,
              ext: '.svg',
              mime: 'image/svg+xml',
              url: '/icons/devtalks.svg',
            },
          },
        },
      },
      {
        name: 'PagoPA LAB',
        icon: {
          data: {
            attributes: {
              name: 'pagopalab.svg',
              alternativeText: null,
              caption: null,
              color: 'blue',
              width: 60,
              height: 61,
              size: 0.54,
              ext: '.svg',
              mime: 'image/svg+xml',
              url: '/icons/pagopalab.svg',
            },
          },
        },
      },
      {
        name: 'Focus',
        icon: {
          data: {
            attributes: {
              name: 'focus.svg',
              alternativeText: null,
              caption: null,
              color: 'blue',
              width: 60,
              height: 61,
              size: 0.54,
              ext: '.svg',
              mime: 'image/svg+xml',
              url: '/icons/focus.svg',
            },
          },
        },
      },
      {
        name: 'Techmeet',
        icon: {
          data: {
            attributes: {
              name: 'techmeet.svg',
              alternativeText: null,
              caption: null,
              color: 'blue',
              width: 60,
              height: 61,
              size: 0.54,
              ext: '.svg',
              mime: 'image/svg+xml',
              url: '/icons/techmeet.svg',
            },
          },
        },
      },
    ],
  },
  decorators: [nextIntlContextDecorator],
};

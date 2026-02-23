import { Meta, StoryObj } from '@storybook/nextjs';
import DesktopFilterSelector from 'nextjs-website/src/components/molecules/DesktopFilterSelector/DesktopFilterSelector';
const meta: Meta<typeof DesktopFilterSelector> = {
  title: 'Molecules/DesktopFilterSelector',
  component: DesktopFilterSelector,
};

export default meta;

export const Showcase: StoryObj<typeof DesktopFilterSelector> = {
  args: {
    selectedFilter: 0,
    selectorFilters: [
      {
        name: 'Tutti',
        icon: {
          data: {
            attributes: {
              name: 'all.png',
              alternativeText: null,
              caption: null,
              color: 'blue',
              width: 60,
              height: 61,
              size: 0.54,
              ext: '.png',
              mime: 'image/png',
              url: 'icons/all.png',
            },
          },
        },
      },
      {
        name: 'Devtalks',
        icon: {
          data: {
            attributes: {
              name: 'devtalks.jpg',
              alternativeText: null,
              caption: null,
              color: 'blue',
              width: 60,
              height: 61,
              size: 0.54,
              ext: '.jpg',
              mime: 'image/jpg',
              url: '/icons/devtalks.jpg',
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
};

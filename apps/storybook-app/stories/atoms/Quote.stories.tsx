import { Meta, StoryObj } from '@storybook/react';
import Quote from '../../../nextjs-website/src/components/atoms/Quote/Quote';

const meta: Meta<typeof Quote> = {
  title: 'Atoms/Quote',
  component: Quote,
};

export default meta;

export const quoteMockProps = {
  quote: "Quis aute iure reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint obcaecat cupiditat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  backgroundImage: {
      name: 'hero-swiper.png',
      width: 1920,
      height: 1080,
      ext: '.png',
      mime: 'image/png',
      url: 'https://developer.pagopa.it/images/hero-swiper.png',
    },
}

export const Showcase: StoryObj<typeof Quote> = {
  args: {
    ...quoteMockProps
  },
};


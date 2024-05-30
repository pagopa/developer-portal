import { Meta, StoryObj } from '@storybook/react';
import CtaSlide from '../../../nextjs-website/src/components/atoms/CtaSlide/CtaSlide';

const meta: Meta<typeof CtaSlide> = {
  title: 'Atoms/CtaSlide',
  component: CtaSlide,
};

export default meta;

export const Showcase: StoryObj<typeof CtaSlide> = {
  args: {
    title: 'This is the title',
    backgroundImage: {
        ext: 'svg',
        height: 1000,
        mime: 'image/svg+xml',
        name: 'app_Io_9bffd556b',
        width: 1000,
        url: 'https://developer.pagopa.it/images/hero-swiper.png'
    },
    subhead: [{
        type: 'paragraph',
        children: [{text: 'This is the subhead', type: 'text'}]
    }],
    titleColor: 'contrastText',
  },
};

import { Meta, StoryObj } from '@storybook/react';
import Newsroom, {
  INewsroomItem,
} from '../../../nextjs-website/src/editorialComponents/Newsroom/Newsroom';
import { nextIntlContextDecorator } from '../next-intl-context.helper';

const meta: Meta<typeof Newsroom> = {
  title: 'EditorialComponents/Newsroom',
  component: Newsroom,
};

export default meta;

const items: INewsroomItem[] = [
  {
    comingSoonLabel: 'Coming soon',
    img: {
      src: 'https://cdn.developer.pagopa.it/homepage_validatore_075dd7ab63.png',
      alt: 'Allegare i documenti',
    },
    title: 'Placeholder newsroom',
    date: {
      date: new Date(),
      locale: 'UTC',
    },
    href: {
      label: 'Placeholder CTA',
      title: 'Placeholder title',
      link: '#',
      translate: true,
    },
    variant: 'h1',
  },
];

export const Showcase: StoryObj<typeof Newsroom> = {
  args: {
    py: 0,
    items: items,
  },
  decorators: [nextIntlContextDecorator],
};

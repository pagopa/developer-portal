import { Meta, StoryObj } from '@storybook/react';
import TutorialPreview from 'ui/components/TutorialPreview';

const meta: Meta<typeof TutorialPreview> = {
  title: 'Components/Tutorial',
  component: TutorialPreview,
  tags: ['autodocs'],
};

export default meta;

export const Preview: StoryObj<typeof TutorialPreview> = {
  args: {
    type: 'tutorial-preview',
    title: 'Tutorial Title',
    preview: {
      title: 'Preview Title',
      description: 'This is a tutorial preview',
      date: '13 luglio 2022',
      link: 'https://www.pagopa.it/',
      image: {
        src: 'https://images.pexels.com/photos/175045/pexels-photo-175045.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        alt: 'An alt text for the image',
      },
    },
  },
};

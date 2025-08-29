import { Meta, StoryObj } from '@storybook/nextjs';
import { InfoCardItem } from 'nextjs-website/src/components/atoms/InfoCardItem/InfoCardItem';

const meta: Meta<typeof InfoCardItem> = {
  title: 'Atoms/InfoCardItem',
  component: InfoCardItem,
};

export default meta;

export const Showcase: StoryObj<typeof InfoCardItem> = {
  args: {
    name: 'This is the name',
    title: 'This is the title',
  },
};

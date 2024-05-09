import { Meta, StoryObj } from '@storybook/react';
import AlertPart from '../../../nextjs-website/src/components/atoms/AlertPart/AlertPart';

const meta: Meta<typeof AlertPart> = {
  title: 'Atoms/AlertPart',
  component: AlertPart,
};

export default meta;

export const Showcase: StoryObj<typeof AlertPart> = {
  args: {
    title: 'This is the title',
    severity: 'info',
    text: 'This is the text',
  },
};

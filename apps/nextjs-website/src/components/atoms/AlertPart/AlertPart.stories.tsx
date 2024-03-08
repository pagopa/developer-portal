import { Meta, StoryObj } from '@storybook/react';
import AlertPart from './AlertPart';

const meta: Meta<typeof AlertPart> = {
  title: 'Atoms/AlertPart',
  component: AlertPart,
};

export default meta;

export const Showcase: StoryObj<typeof AlertPart> = {
  args: {
    title: 'Coming soon',
    text: 'This feature will be available soon. Stay tuned!',
    severity: 'info',
  },
};

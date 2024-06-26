import { Meta, StoryObj } from '@storybook/react';
import TimeSlot from '../../../nextjs-website/src/components/atoms/TimeSlot/TimeSlot';

const meta: Meta<typeof TimeSlot> = {
  title: 'Atoms/TimeSlot',
  component: TimeSlot,
};

export default meta;

export const Showcase: StoryObj<typeof TimeSlot> = {
  args: {
    start: '2021-10-01T10:00:00Z',
    end: '2021-10-01T12:00:00Z',
  },
};

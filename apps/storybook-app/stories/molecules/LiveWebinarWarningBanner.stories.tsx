import { Meta, StoryObj } from '@storybook/nextjs';
import LiveWebinarWarningBanner from 'nextjs-website/src/components/molecules/LiveWebinarWarningBanner/LiveWebinarWarningBanner';

const meta: Meta<typeof LiveWebinarWarningBanner> = {
  title: 'Molecules/LiveWebinarWarningBanner',
  component: LiveWebinarWarningBanner,
};

export default meta;
type Story = StoryObj<typeof LiveWebinarWarningBanner>;

export const Default: Story = {
  args: {},
};

import { Meta, StoryObj } from '@storybook/react';
import SiteLabel from '../../../nextjs-website/src/components/atoms/SiteLabel/SiteLabel';

const meta: Meta<typeof SiteLabel> = {
  title: 'Atoms/SiteLabel',
  component: SiteLabel,
};

export default meta;

export const Showcase: StoryObj<typeof SiteLabel> = {
  args: {
    title: 'This is the title',
    boldTitle: 'This is the bold title',
    color: 'contrastText'
  },
};

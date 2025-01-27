import { Meta, StoryObj } from '@storybook/react';
import { BannerLinks } from 'nextjs-website/src/components/molecules/BannerLinks/BannerLinks';
import { bannerLinksFixture } from '../fixtures/bannerLinksFixtures';

const meta: Meta<typeof BannerLinks> = {
  title: 'Molecules/BannerLinks',
  component: BannerLinks,
};

export default meta;

export const Showcase: StoryObj<typeof BannerLinks> = {
  args: {
    bannerLinks: bannerLinksFixture,
  },
};

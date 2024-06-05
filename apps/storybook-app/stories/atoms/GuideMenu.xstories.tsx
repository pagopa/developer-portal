import { Meta, StoryObj } from '@storybook/react';
import GuideMenu from '../../../nextjs-website/src/components/atoms/GuideMenu/GuideMenu';

const meta: Meta<typeof GuideMenu> = {
  title: 'Atoms/GuideMenu',
  component: GuideMenu,
};

export default meta;

export const Showcase: StoryObj<typeof GuideMenu> = {
  args: {
    guideName: 'This is the guideName',
    assetsPrefix: 'This is the assetsPrefix',
    menu: '',
  },
};

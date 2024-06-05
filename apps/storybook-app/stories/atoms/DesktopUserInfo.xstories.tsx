// TODO: Fix error Module not found: Error: Can't resolve '@/helpers/user.helper' in 'developer-portal/apps/nextjs-website/src/components/atoms/DesktopUserInfo'
import { Meta, StoryObj } from '@storybook/react';
import DesktopUserInfo from '../../../nextjs-website/src/components/atoms/DesktopUserInfo/DesktopUserInfo';

const meta: Meta<typeof DesktopUserInfo> = {
  title: 'Atoms/DesktopUserInfo',
  component: DesktopUserInfo,
};

export default meta;

export const Showcase: StoryObj<typeof DesktopUserInfo> = {
  args: {},
};

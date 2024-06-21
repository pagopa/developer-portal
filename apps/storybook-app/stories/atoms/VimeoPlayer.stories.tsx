import { Meta, StoryObj } from '@storybook/react';
import VimeoPlayer from '../../../nextjs-website/src/components/atoms/VimeoPlayer/VimeoPlayer';

const meta: Meta<typeof VimeoPlayer> = {
  title: 'Atoms/VimeoPlayer',
  component: VimeoPlayer,
};

export default meta;

export const Showcase: StoryObj<typeof VimeoPlayer> = {
  args: {
    playerSrc: 'https://vimeo.com/event/4153381/embed',
  },
};

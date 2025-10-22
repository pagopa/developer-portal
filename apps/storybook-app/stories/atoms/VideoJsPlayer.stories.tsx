import { Meta, StoryObj } from '@storybook/nextjs';
import VideoJsPlayer from 'nextjs-website/src/components/atoms/VideoJsPlayer/VideoJsPlayer';

const meta: Meta<typeof VideoJsPlayer> = {
  title: 'Atoms/VideoJsPlayer',
  component: VideoJsPlayer,
};

export default meta;

export const Showcase: StoryObj<typeof VideoJsPlayer> = {
  args: {
    techOrder: ['AmazonIVS'],
    autoplay: true,
    controls: true,
    playsInline: true,
    src: 'https://video.dev.developer.pagopa.it/ivs/v1/039804388894/aTDsKTAzIgD0/2025/9/23/8/37/9d44hRI1jhzc/media/hls/master.m3u8',
  },
};

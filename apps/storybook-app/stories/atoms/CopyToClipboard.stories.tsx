import { Meta, StoryObj } from '@storybook/react';
import CopyToClipboard from '../../../nextjs-website/src/components/atoms/CopyToClipboard/CopyToClipboard';

const meta: Meta<typeof CopyToClipboard> = {
  title: 'Atoms/CopyToClipboard',
  component: CopyToClipboard,
};

export default meta;

export const Showcase: StoryObj<typeof CopyToClipboard> = {
  args: {
    textToCopy: 'This is the text to copy',
    copiedTooltipLabel: 'Copied!',
    copyColor: 'primary',
    iconSize: '24px',
  },
};

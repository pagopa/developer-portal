import { Meta, StoryObj } from '@storybook/react';
import ConfirmationModal from '../../../nextjs-website/src/components/atoms/ConfirmationModal/ConfirmationModal';

const meta: Meta<typeof ConfirmationModal> = {
  title: 'Atoms/ConfirmationModal',
  component: ConfirmationModal,
};

export default meta;

export const Showcase: StoryObj<typeof ConfirmationModal> = {
  args: {
    title: 'This is the title',
    text: 'This is the text',
    cancelCta: {
      label: 'Cancel',
    },
    confirmCta: {
      label: 'Confirm',
    },
    open: true,
  },
};

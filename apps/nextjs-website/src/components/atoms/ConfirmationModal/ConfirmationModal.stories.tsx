import { Meta, StoryObj } from '@storybook/react';
import ConfirmationModal from './ConfirmationModal';

const meta: Meta<typeof ConfirmationModal> = {
  title: 'Atoms/ConfirmationModal',
  component: ConfirmationModal,
};

export default meta;

export const Showcase: StoryObj<typeof ConfirmationModal> = {
  args: {
    title: 'Are you sure?',
    text: 'This action cannot be undone.',
    open: true,
    setOpen: () => null,
    cancelCta: {
      label: 'Cancel',
      onClick: () => null,
    },
    confirmCta: {
      label: 'Delete',
      onClick: () => null,
    },
  },
};

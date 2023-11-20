'use client';

import { Box, Button, Modal, Stack, Typography, useTheme } from '@mui/material';
import { FC } from 'react';

type Cta = {
  onClick?: () => null;
  label: string;
  disabled?: boolean;
};

type ConfirmationModalProps = {
  title: string;
  text: string;
  cancelCta?: Cta;
  confirmCta?: Cta;
  open: boolean;
  setOpen: (value: boolean) => null;
};
const ConfirmationModal: FC<ConfirmationModalProps> = ({
  title,
  text,
  cancelCta,
  confirmCta,
  open,
  setOpen,
}) => {
  const { palette } = useTheme();
  const handleClose = () => setOpen(false);

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          maxWidth: 600,
          backgroundColor: palette.background.default,
          borderRadius: 1,
          boxShadow: 24,
          p: 4,
        }}
      >
        <Typography variant='h6' component='h2'>
          {title}
        </Typography>
        <Typography sx={{ mt: 2 }}>{text}</Typography>
        <Stack pt={4} flexDirection={'row'} justifyContent={'end'} gap={2}>
          {cancelCta && (
            <Button
              disabled={!!cancelCta.disabled && cancelCta.disabled}
              variant={'outlined'}
              onClick={cancelCta?.onClick}
            >
              {cancelCta.label}
            </Button>
          )}
          {confirmCta && (
            <Button
              disabled={!!confirmCta.disabled && confirmCta.disabled}
              variant={'contained'}
              onClick={confirmCta?.onClick}
            >
              {confirmCta.label}
            </Button>
          )}
        </Stack>
      </Box>
    </Modal>
  );
};

export default ConfirmationModal;

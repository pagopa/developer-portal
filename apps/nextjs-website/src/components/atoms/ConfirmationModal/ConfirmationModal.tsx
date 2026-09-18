'use client';

import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Modal,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';
import { FC, useEffect, useState } from 'react';

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
  checkboxLabel?: string;
  checked?: boolean;
  onCheckboxChange?: (checked: boolean) => null;
};

const ConfirmationModal: FC<ConfirmationModalProps> = ({
  title,
  text,
  cancelCta,
  confirmCta,
  open,
  setOpen,
  checkboxLabel,
  checked = false,
  onCheckboxChange,
}) => {
  const { palette } = useTheme();
  const handleClose = () => setOpen(false);
  const [internalChecked, setInternalChecked] = useState(checked);
  useEffect(() => {
    setInternalChecked(checked);
  }, [checked]);
  const handleCheckboxChange = (value: boolean) => {
    setInternalChecked(value);
    onCheckboxChange?.(value);
  };
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
              disabled={!!cancelCta.disabled}
              variant={'outlined'}
              onClick={cancelCta?.onClick}
            >
              {cancelCta.label}
            </Button>
          )}
          {confirmCta && (
            <Button
              disabled={!!confirmCta.disabled}
              variant={'contained'}
              onClick={confirmCta?.onClick}
            >
              {confirmCta.label}
            </Button>
          )}
        </Stack>

        {checkboxLabel && checkboxLabel.length > 0 && (
          <Stack pt={'24px'} flexDirection={'row'} justifyContent={'end'}>
            <FormControlLabel
              sx={{ marginRight: '0 !important' }}
              control={
                <Checkbox
                  checked={internalChecked}
                  onChange={(e) => handleCheckboxChange(e.target.checked)}
                />
              }
              label={checkboxLabel}
            />
          </Stack>
        )}
      </Box>
    </Modal>
  );
};

export default ConfirmationModal;

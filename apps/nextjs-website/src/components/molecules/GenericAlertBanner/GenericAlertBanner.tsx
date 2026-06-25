'use client';
import React, { FC, ReactNode, useState } from 'react';
import { Alert, Box, IconButton, Typography, useTheme } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

type GenericAlertBannerProps = {
  canBeHidden: boolean;
  icon?: ReactNode;
  children?: ReactNode;
  title?: string;
};

const GenericAlertBanner: FC<GenericAlertBannerProps> = ({
  canBeHidden = false,
  icon,
  children,
  title,
}: GenericAlertBannerProps) => {
  const [visible, setVisible] = useState(true);
  const { palette } = useTheme();

  if (!visible) return null;

  return (
    <Alert
      severity='warning'
      icon={false}
      sx={{
        mt: '64px',
        mb: '32px',
        width: '100%',
        backgroundColor: palette.primaryAction.selected,
        border: `1px ${palette.primaryAction.selected}`,
        borderRadius: 2,
        '& .MuiAlert-message': {
          width: '100%',
          p: 0,
        },
        '& .MuiAlert-action': {
          height: '100%',
          alignSelf: 'flex-start',
          p: 0,
        },
      }}
      action={
        canBeHidden ? (
          <IconButton
            aria-label='close'
            size='small'
            onClick={() => setVisible(false)}
            sx={{ color: palette.text.secondary }}
          >
            <CloseIcon fontSize='small' />
          </IconButton>
        ) : null
      }
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          mt: '8px',
          mb: 1,
          ml: '16px',
        }}
      >
        {icon}
        <Typography
          fontSize={'16px'}
          fontWeight={600}
          color={palette.text.primary}
        >
          {title}
        </Typography>
      </Box>
      {children}
    </Alert>
  );
};

export default GenericAlertBanner;

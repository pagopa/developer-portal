'use client';

import { Box, Typography, useTheme } from '@mui/material';
import React from 'react';
import { ButtonNaked } from '@/editorialComponents/Footer/components/ButtonNaked';

interface AgreementItemProps {
  title: string;
  description: string;
  subscribed: boolean;
  loading?: boolean;
  disabled?: boolean;
  // eslint-disable-next-line functional/no-return-void
  onSubscribe: () => void;
  // eslint-disable-next-line functional/no-return-void
  onUnsubscribe: () => void;
  unsubscribeLabel: string;
  subscribeLabel: string;
}

const AgreementItem: React.FC<AgreementItemProps> = ({
  title,
  description,
  subscribed,
  loading = false,
  disabled = false,
  onSubscribe,
  onUnsubscribe,
  unsubscribeLabel,
  subscribeLabel,
}) => {
  const { palette } = useTheme();

  return (
    <>
      <Typography
        variant='h6'
        sx={{
          marginBottom: '24px',
          fontSize: '16px !important',
          fontWeight: '600',
        }}
      >
        {title}
      </Typography>
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          gap: { xs: '10px', md: '100px' },
        }}
      >
        <Typography
          variant='body2'
          sx={{
            fontSize: '14px',
            color: palette.text.secondary,
          }}
        >
          {description}
        </Typography>
        <Box
          sx={{
            margin: 0,
            padding: 0,
            minWidth: '110px',
            textAlign: 'right',
          }}
        >
          {subscribed ? (
            <ButtonNaked
              disabled={loading || disabled}
              sx={{
                color: palette.error.dark,
                whiteSpace: 'nowrap',
              }}
              onClick={onUnsubscribe}
            >
              {unsubscribeLabel}
            </ButtonNaked>
          ) : (
            <ButtonNaked
              disabled={loading || disabled}
              sx={{ whiteSpace: 'nowrap' }}
              onClick={onSubscribe}
              color='primary'
            >
              {subscribeLabel}
            </ButtonNaked>
          )}
        </Box>
      </Box>
    </>
  );
};

export default AgreementItem;

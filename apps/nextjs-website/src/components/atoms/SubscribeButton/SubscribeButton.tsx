'use client';
import {
  Box,
  Button,
  CircularProgress,
  Typography,
  useTheme,
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import { useTranslations } from 'next-intl';
import React from 'react';

export type SubscribeButtonProps = {
  disabled?: boolean;
  isLoading: boolean;
  isSubscribed?: boolean;
  onSubscribe: () => null;
  onCancelSubscription: () => null;
  subscribeLabel?: string;
};

const SubscribeButton = ({
  disabled = false,
  isLoading,
  isSubscribed = false,
  onSubscribe,
  onCancelSubscription,
  subscribeLabel = 'default',
}: SubscribeButtonProps) => {
  const t = useTranslations('shared');
  const { palette } = useTheme();

  return (
    <Box mt={4} display={'flex'} flexDirection={'row'} gap={2}>
      {isSubscribed ? (
        <>
          <Typography
            variant='body2'
            fontWeight={'700'}
            fontSize={'16px'}
            display={'flex'}
            flexDirection={'row'}
            alignItems={'center'}
            sx={{
              color: palette.text.secondary,
            }}
          >
            <CheckIcon
              style={{ marginRight: 8, height: 24, width: 24 }}
              color={'success'}
            />
            {t('subscribeButton.subscribedLabel')}
          </Typography>
          <Button
            color={'error'}
            startIcon={
              isLoading && (
                <CircularProgress
                  size={24}
                  sx={{
                    color: palette.text.disabled,
                  }}
                />
              )
            }
            disabled={disabled || isLoading}
            variant={'outlined'}
            onClick={onCancelSubscription}
          >
            {t('subscribeButton.unsubscribeLabel')}
          </Button>
        </>
      ) : (
        <Button
          startIcon={
            isLoading && (
              <CircularProgress
                size={24}
                sx={{
                  color: palette.text.disabled,
                }}
              />
            )
          }
          disabled={disabled || isLoading}
          variant={'contained'}
          onClick={!isLoading ? onSubscribe : undefined}
        >
          {t(`subscribeButton.subscribeLabel.${subscribeLabel}`)}
        </Button>
      )}
    </Box>
  );
};

export default SubscribeButton;

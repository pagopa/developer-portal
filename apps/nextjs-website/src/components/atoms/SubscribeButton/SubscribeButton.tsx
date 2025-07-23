'use client';
import {
  Box,
  Button,
  CircularProgress,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import { useTranslations } from 'next-intl';
import React from 'react';

export type SubscribeButtonProps = {
  disabled?: boolean;
  isLoading: boolean;
  isSubscribed?: boolean;
  onSubscribe: () => Promise<null>;
  onCancelSubscription: () => Promise<null>;
  subscribeLabel?: string;
  textColor?: string;
};

const SubscribeButton = ({
  disabled = false,
  isLoading,
  isSubscribed = false,
  onSubscribe,
  onCancelSubscription,
  subscribeLabel = 'default',
  textColor = 'white',
}: SubscribeButtonProps) => {
  const t = useTranslations('shared');
  const { palette } = useTheme();
  const isSmallScreen = useMediaQuery('(max-width: 1000px)');

  return (
    <Box
      mt={4}
      display={'flex'}
      flexDirection={isSmallScreen ? 'column' : 'row'}
      gap={2}
    >
      {isSubscribed ? (
        <>
          <Button
            disabled={true}
            variant='contained'
            startIcon={
              <CheckIcon sx={{ height: 24, width: 24, color: 'white' }} />
            }
            sx={{
              '&:disabled': {
                backgroundColor: theme.success.dark,
              },
            }}
          >
            <Typography
              variant='body2'
              fontWeight={'700'}
              fontSize={'16px'}
              sx={{
                color: 'white',
              }}
            >
              {t('subscribeButton.subscribedLabel')}
            </Typography>
          </Button>

          <Button
            sx={{ color: textColor }}
            startIcon={
              isLoading && (
                <CircularProgress
                  size={24}
                  sx={{
                    color: 'white',
                  }}
                />
              )
            }
            disabled={disabled || isLoading}
            variant={'text'}
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

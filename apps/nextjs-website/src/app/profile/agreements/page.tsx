'use client';

import { useTranslations } from 'next-intl';
import {
  Alert,
  Box,
  Divider,
  Link as LinkMui,
  Snackbar,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';
import Link from 'next/link';
import React, { ReactNode, useState } from 'react';
import { ButtonNaked } from '@/editorialComponents/Footer/components/ButtonNaked';
import { useUser } from '@/helpers/user.helper';
import { snackbarAutoHideDurationMs } from '@/config';

// TODO: Remove this code duplication and manage messages with a dedicated service
interface Info {
  message: string;
  isError: boolean;
}

const Agreements = () => {
  const t = useTranslations('profile.agreements');
  const { user, loading, setUserAttributes } = useUser();

  const { palette } = useTheme();

  const [info, setInfo] = useState<Info | null>(null);

  const hasAcceptedMailingListSubscription =
    user?.attributes['custom:mailinglist_accepted'] === 'true';

  const [isSubscriptionButtonDisabled, setIsSubscriptionButtonDisabled] =
    useState(false);

  const handleSubscribe = () => {
    if (user) {
      setIsSubscriptionButtonDisabled(true);
      setUserAttributes(
        {
          ...user.attributes,
          'custom:mailinglist_accepted': 'true',
        },
        () => {
          setIsSubscriptionButtonDisabled(false);
          return null;
        },
        () => {
          setInfo({ message: t('newsletter.error.subscribe'), isError: true });
          setIsSubscriptionButtonDisabled(false);
          return null;
        }
      );
    }
  };
  const handleUnsubscribe = () => {
    if (user) {
      setIsSubscriptionButtonDisabled(true);
      setUserAttributes(
        {
          ...user.attributes,
          'custom:mailinglist_accepted': 'false',
        },
        () => {
          setIsSubscriptionButtonDisabled(false);
          return null;
        },
        () => {
          setInfo({
            message: t('newsletter.error.unsubscribe'),
            isError: true,
          });
          setIsSubscriptionButtonDisabled(false);
          return null;
        }
      );
    }
  };

  const privacyStatementLink: ReactNode = (
    <LinkMui
      component={Link}
      color='primary.main'
      underline='none'
      href={'/privacy-policy'}
      aria-label={t('privacy.statement.labelOfLinkToReplace')}
      title={t('privacy.statement.labelOfLinkToReplace')}
    >
      {t('privacy.statement.labelOfLinkToReplace')}
    </LinkMui>
  );

  const privacyStatement = t('privacy.statement.text')
    .split('$')
    .reduce((acc: ReactNode[], curr: ReactNode) => {
      if (curr === 'labelOfLinkToReplace') {
        return [...acc, privacyStatementLink];
      }
      return [...acc, ` ${curr} `];
    }, [])
    .map((node, index) => <span key={index}>{node}</span>);

  return (
    <>
      <Stack
        sx={{
          padding: { xs: '40px 24px', md: '80px 40px' },
          width: '100%',
          maxWidth: '694px',
        }}
      >
        <Typography variant='h4' sx={{ marginBottom: '40px' }}>
          {t('title')}
        </Typography>
        <Typography
          variant='h6'
          sx={{
            marginBottom: '24px',
            fontSize: '16px !important',
            fontWeight: '600',
          }}
        >
          {t('newsletter.title')}
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
            {t('newsletter.description')}
          </Typography>
          <Box
            sx={{
              margin: 0,
              padding: 0,
              minWidth: '110px',
              textAlign: 'right',
            }}
          >
            {hasAcceptedMailingListSubscription ? (
              <ButtonNaked
                disabled={loading || isSubscriptionButtonDisabled}
                sx={{
                  color: palette.error.dark,
                  whiteSpace: 'nowrap',
                }}
                onClick={handleUnsubscribe}
              >
                {t('newsletter.unsubscribe')}
              </ButtonNaked>
            ) : (
              <ButtonNaked
                disabled={loading || isSubscriptionButtonDisabled}
                sx={{ whiteSpace: 'nowrap' }}
                onClick={handleSubscribe}
                color='primary'
              >
                {t('newsletter.subscribe')}
              </ButtonNaked>
            )}
          </Box>
        </Box>
        <Divider sx={{ marginY: '32px' }} />
        <Typography
          variant='h6'
          sx={{
            marginBottom: '24px',
            fontSize: '16px !important',
            fontWeight: '600',
          }}
        >
          {t('privacy.title')}
        </Typography>
        <Typography
          variant='body2'
          sx={{
            marginBottom: '24px',
            fontSize: '14px',
            color: palette.text.secondary,
          }}
        >
          {t('privacy.basicData')}
        </Typography>
        <Typography
          variant='body2'
          sx={{
            marginBottom: '24px',
            fontSize: '14px',
            color: palette.text.secondary,
          }}
        >
          {privacyStatement}
        </Typography>
      </Stack>
      <Snackbar
        open={!!info}
        autoHideDuration={snackbarAutoHideDurationMs}
        onClose={() => setInfo(null)}
      >
        <Alert severity={info?.isError ? 'error' : 'success'}>
          {info?.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Agreements;

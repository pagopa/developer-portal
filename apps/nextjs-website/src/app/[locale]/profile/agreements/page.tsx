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
  const t = useTranslations();
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
          setInfo({
            message: t('profile.agreements.newsletter.error.subscribe'),
            isError: true,
          });
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
            message: t('profile.agreements.newsletter.error.unsubscribe'),
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
      aria-label={t(
        'profile.agreements.privacy.statement.labelOfLinkToReplace'
      )}
      title={t('profile.agreements.privacy.statement.labelOfLinkToReplace')}
    >
      {t('profile.agreements.privacy.statement.labelOfLinkToReplace')}
    </LinkMui>
  );

  const privacyStatement = t('profile.agreements.privacy.statement.text')
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
      <title>{`${t('devPortal.title')} | ${t(
        'profile.agreements.title'
      )}`}</title>
      <Stack
        sx={{
          padding: { xs: '40px 24px', md: '80px 40px' },
          width: '100%',
          maxWidth: '694px',
        }}
      >
        <Typography variant='h4' sx={{ marginBottom: '40px' }}>
          {t('profile.agreements.title')}
        </Typography>
        <Typography
          variant='h6'
          sx={{
            marginBottom: '24px',
            fontSize: '16px !important',
            fontWeight: '600',
          }}
        >
          {t('profile.agreements.newsletter.title')}
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
            {t('profile.agreements.newsletter.description')}
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
                {t('profile.agreements.newsletter.unsubscribe')}
              </ButtonNaked>
            ) : (
              <ButtonNaked
                disabled={loading || isSubscriptionButtonDisabled}
                sx={{ whiteSpace: 'nowrap' }}
                onClick={handleSubscribe}
                color='primary'
              >
                {t('profile.agreements.newsletter.subscribe')}
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
          {t('profile.agreements.privacy.title')}
        </Typography>
        <Typography
          variant='body2'
          sx={{
            marginBottom: '24px',
            fontSize: '14px',
            color: palette.text.secondary,
          }}
        >
          {t('profile.agreements.privacy.basicData')}
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

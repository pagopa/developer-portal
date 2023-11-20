'use client';

import { useTranslations } from 'next-intl';
import {
  Box,
  Divider,
  Link as LinkMui,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';
import Link from 'next/link';
import React, { ReactNode } from 'react';
import { ButtonNaked } from '@/editorialComponents/Footer/components/ButtonNaked';

const Agreements = () => {
  const t = useTranslations('profile.agreements');
  const { palette } = useTheme();

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
    <Stack sx={{ padding: '30px', width: '100%', maxWidth: '694px' }}>
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
        <Box sx={{ margin: 0, padding: 0 }}>
          <ButtonNaked disabled={true}>{t('newsletter.subscribe')}</ButtonNaked>
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
  );
};

export default Agreements;

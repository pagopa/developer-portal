'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Typography } from '@mui/material';
import { Stack } from '@mui/system';

const CertificateList = () => {
  const t = useTranslations();
  return (
    <>
      <title>{`${t('devPortal.title')} | ${t(
        'profile.certificateList.title'
      )}`}</title>
      <Stack
        sx={{
          padding: { xs: '40px 24px', md: '80px 40px' },
          width: '100%',
          maxWidth: '694px',
        }}
      >
        <Typography variant='h4' sx={{ marginBottom: '40px' }}>
          {t('profile.certificateList.title')}
        </Typography>
      </Stack>
    </>
  );
};

export default CertificateList;

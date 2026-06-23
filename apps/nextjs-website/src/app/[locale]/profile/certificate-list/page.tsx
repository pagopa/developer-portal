'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Typography, useTheme } from '@mui/material';
import { Stack } from '@mui/system';
import CardsGrid from '@/components/molecules/CardsGrid/CardsGrid';
import GenericAlertBanner from '@/components/molecules/GenericAlertBanner/GenericAlertBanner';
import InfoIcon from '@mui/icons-material/Info';

const CertificateList = () => {
  const { palette } = useTheme();
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
        <CardsGrid
          cards={[
            {
              title:
                'Esplorando pagoPA: Come generare il pdf di un avviso di pagamento',
              text: '',
              useSrc: false,
            },
          ]}
        ></CardsGrid>
        <GenericAlertBanner
          canBeHidden={false}
          title={t('profile.certificateList.warning')}
          icon={
            <InfoIcon width={'22px'} sx={{ color: palette.primary.main }} />
          }
        >
          <Typography
            color={palette.text.primary}
            fontWeight={400}
            fontSize={'14px'}
            mb={2.5}
            mx={'16px'}
          >
            {
              t.rich('profile.certificateList.body', {
                strong: (chunks) => <strong>{chunks}</strong>,
                br: () => <br></br>,
              }) as string
            }
          </Typography>
        </GenericAlertBanner>
      </Stack>
    </>
  );
};

export default CertificateList;

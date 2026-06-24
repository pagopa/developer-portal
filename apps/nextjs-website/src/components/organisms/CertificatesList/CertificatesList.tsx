'use client';
import { Box, Typography, useTheme } from '@mui/material';
import { useTranslations } from 'next-intl';
import { Stack } from '@mui/system';
import CardsGrid from '@/components/molecules/CardsGrid/CardsGrid';
import DownloadIcon from '@mui/icons-material/Download';
import GenericAlertBanner from '@/components/molecules/GenericAlertBanner/GenericAlertBanner';
import InfoIcon from '@mui/icons-material/Info';
import React from 'react';
import { useUser } from '@/helpers/user.helper';
import { Webinar } from '@/lib/webinars/types';

export type CertificatesListProps = {
  webinars: readonly Webinar[];
};

const CertificatesList = ({ webinars }: CertificatesListProps) => {
  const { palette } = useTheme();
  const t = useTranslations();

  const { webinarSubscriptions } = useUser();

  const subscribedWebinars = webinarSubscriptions?.map((webinar) => {
    return webinar.webinarId;
  });
  const filteredWebinars = webinars.filter((webinar) => {
    return subscribedWebinars?.includes(webinar.slug) ? webinar : null;
  });

  const cardsToShow = filteredWebinars.map((webinar) => {
    return {
      title: webinar.title,
      text: '',
      useSrc: false,
      ctaLabel: 'Scarica attestato',
      endIcon: <DownloadIcon />,
      image: (
        <Box
          borderRadius={'16px'}
          component='img'
          width={'100%'}
          src={webinar.imagePath}
        />
      ),
      cardContentStyle: {
        p: '12px',
      },
      ctaStyle: {
        fontWeight: 700,
        fontSize: '16px',
        letterSpacing: '0.3px',
        fontStyle: 'bold',
        pl: '0',
      },
    };
  });

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
          containerSx={{ px: '0', overflow: 'visible' }}
          spacing={'12px'}
          cards={cardsToShow}
          ctaButtonsVariant='text'
        />
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

export default CertificatesList;

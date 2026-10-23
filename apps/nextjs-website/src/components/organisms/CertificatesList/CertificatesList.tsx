'use client';
import { Box, Typography, useTheme } from '@mui/material';
import { useLocale, useTranslations } from 'next-intl';
import { Stack } from '@mui/system';
import CardsGrid from '@/components/molecules/CardsGrid/CardsGrid';
import DownloadIcon from '@mui/icons-material/Download';
import GenericAlertBanner from '@/components/molecules/GenericAlertBanner/GenericAlertBanner';
import InfoIcon from '@mui/icons-material/Info';
import React from 'react';
import { useUser } from '@/helpers/user.helper';
import { Webinar } from '@/lib/webinars/types';
import Spinner from '@/components/atoms/Spinner/Spinner';

export type CertificatesListProps = {
  webinars: readonly Webinar[];
};

const handleDownload = async (
  userName: string,
  webinarName: string,
  title: string,
  subtitle: string,
  certification: string,
  attended: string,
  createdOn: string,
  createdAt: string
) => {
  const [{ pdf }, { default: CertificateTemplate }] = await Promise.all([
    import('@react-pdf/renderer'),
    import('@/components/templates/CertificateTemplate/CertificateTemplate'),
  ]);

  const blob = await pdf(
    <CertificateTemplate
      userName={userName}
      webinarName={webinarName}
      createdOn={createdOn}
      title={title}
      subtitle={subtitle}
      createdAt={createdAt}
      certification={certification}
      attended={attended}
    />
  ).toBlob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  // eslint-disable-next-line functional/immutable-data
  link.href = url;
  // eslint-disable-next-line functional/immutable-data
  link.download = 'webinar-certificate.pdf';
  link.click();
  URL.revokeObjectURL(url);
};

const CertificatesList = ({ webinars }: CertificatesListProps) => {
  const { palette } = useTheme();
  const t = useTranslations();
  const locale = useLocale();

  const { userFullName, webinarCertificates, webinarDataLoading } = useUser();

  if (webinarDataLoading) {
    return <Spinner />;
  }

  const filteredWebinars = webinars.filter((webinar) =>
    webinarCertificates.some(
      (certificate) => certificate.webinarid === webinar.slug
    )
  );

  const cardsToShow = filteredWebinars.map((webinar) => {
    const certificate = webinarCertificates.find(
      (certificate) => certificate.webinarid === webinar.slug
    );

    const certificateCreatedAt = certificate?.reached_80_percent_at;

    const formattedCertificateDate = certificateCreatedAt
      ? new Date(
          certificateCreatedAt.replace(' UTC', 'Z').replace(' ', 'T')
        ).toLocaleString(locale, {
          dateStyle: 'long',
          timeStyle: 'short',
        })
      : '';

    return {
      title: webinar.title,
      text: '',
      useSrc: false,
      ctaLabel: t('profile.certificateList.cta'),
      endIcon: <DownloadIcon />,
      onClick: () =>
        handleDownload(
          userFullName,
          webinar.title,
          t('profile.certificateList.certificate.title'),
          t('profile.certificateList.certificate.subtitle'),
          t('profile.certificateList.certificate.certification'),
          t('profile.certificateList.certificate.attended'),
          formattedCertificateDate,
          t('profile.certificateList.certificate.createdAt')
        ),
      image: (
        <Box
          borderRadius={'16px'}
          component='img'
          width={'100%'}
          src={webinar.imagePath}
          alt={webinar.title}
        />
      ),
      cardContentStyle: {
        p: '12px',
      },
      ctaStyle: {
        fontWeight: 700,
        fontSize: '16px',
        letterSpacing: '0.3px',
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
            {t.rich('profile.certificateList.body', {
              strong: (chunks) => <strong>{chunks}</strong>,
              br: () => <br></br>,
            })}
          </Typography>
        </GenericAlertBanner>
      </Stack>
    </>
  );
};

export default CertificatesList;

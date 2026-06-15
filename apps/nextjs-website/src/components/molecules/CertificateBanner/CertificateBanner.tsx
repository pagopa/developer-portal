import { Box, Typography, useTheme } from '@mui/material';
import Image from 'next/image';
import React from 'react';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import LinkButton from '@/components/atoms/LinkButton/LinkButton';

export type CertificateBannerProps = {
  imagePath?: string;
};

const CertificateBanner = ({ imagePath }: CertificateBannerProps) => {
  const { locale } = useParams<{ locale: string }>();
  const { palette } = useTheme();
  const t = useTranslations('webinar.certificationBanner');
  return (
    <Box
      sx={{
        width: '100%',
        height: { sm: '400px', md: '277px' },
        backgroundColor: palette.grey[50],
        borderRadius: '19px',
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
      }}
    >
      <Box
        sx={{
          maxWidth: '576px',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
          p: { xs: 4, md: '36px 0px 36px 60px' },
        }}
      >
        <Typography
          variant='h4'
          fontWeight={700}
          color={palette.text.primary}
          fontSize={'32px'}
          lineHeight={'42px'}
          letterSpacing={'0'}
        >
          {t('title')}
        </Typography>

        <Typography
          fontWeight={400}
          fontSize={'18px'}
          lineHeight={'24px'}
          color={palette.text.primary}
        >
          {t('description')}
        </Typography>
        <LinkButton
          label={t('cta')}
          href={`/${locale}/profile`}
          showArrow={false}
        ></LinkButton>
      </Box>

      {imagePath && (
        <Image
          src={imagePath}
          alt={t('title')}
          width={333}
          height={199}
          style={{
            display: 'block',
            borderRadius: '8px',
            boxShadow: '0 -4px 15px rgba(0,0,0,0.08)',
          }}
        />
      )}
    </Box>
  );
};

export default CertificateBanner;

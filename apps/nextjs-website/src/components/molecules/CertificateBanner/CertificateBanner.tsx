import { Media } from '@/lib/media/types';
import { Box, Link as LinkMui, Typography, useTheme } from '@mui/material';
import Link from 'next/link';
import React from 'react';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import LinkButton from '@/components/atoms/LinkButton/LinkButton';

export type CertificateBannerProps = {
  image?: Media;
};

const CertificateBanner = ({ image }: CertificateBannerProps) => {
  const { locale } = useParams<{ locale: string }>();
  const { palette } = useTheme();
  const t = useTranslations('webinar.certificationBanner');
  return (
    <Box
      sx={{
        maxHeight: { sm: '400px', md: '277px' },
        backgroundColor: palette.grey[50],
        borderRadius: '19px',
        mx: { xs: 2, sm: 4, md: '106px' },
        my: '64px',
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        overflow: 'hidden',
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

      {image?.url && (
        <Box
          sx={{
            flex: 1,
            display: { xs: 'none', md: 'flex' },
            alignItems: 'flex-end',
            flexShrink: 0,
            justifyContent: 'flex-end',
            pt: '36px',
            pr: '60px',
          }}
        >
          <Box
            component='img'
            src={image.url}
            alt={image.alternativeText ?? t('title')}
            sx={{
              display: 'block',
              width: '100%',
              maxWidth: '404px',
              height: 'auto',
              objectFit: 'cover',
              borderTopLeftRadius: '8px',
              borderTopRightRadius: '8px',
              boxShadow: '0 -4px 15px rgba(0,0,0,0.08)',
              transform: 'translateY(24px)',
            }}
          />
        </Box>
      )}
    </Box>
  );
};

export default CertificateBanner;

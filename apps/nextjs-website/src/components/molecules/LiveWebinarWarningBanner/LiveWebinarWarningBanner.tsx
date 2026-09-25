'use client';
import React, { useState } from 'react';
import { Box, Link, Typography, useTheme } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import { useTranslations } from 'next-intl';
import GenericAlertBanner from '@/components/molecules/GenericAlertBanner/GenericAlertBanner';

type LiveWebinarWarningBannerProps = {
  onEnableConsent: () => null;
};

const LiveWebinarWarningBanner = ({
  onEnableConsent,
}: LiveWebinarWarningBannerProps) => {
  const [consented, setConsented] = useState(false);
  const t = useTranslations('webinar');
  const { palette } = useTheme();

  const handleEnable = () => {
    setConsented(true);
    onEnableConsent();
  };

  return (
    <GenericAlertBanner
      canBeHidden={true}
      icon={
        <ReportProblemIcon
          width={'22px'}
          sx={{ color: palette.primary.main }}
        />
      }
      title={t('consent_banner.title')}
    >
      <Typography
        color={palette.text.primary}
        fontWeight={500}
        fontSize={'14px'}
        mb={2.5}
        ml={'16px'}
      >
        {
          t.rich('consent_banner.body', {
            strong: (chunks) => <strong>{chunks}</strong>,
            br: () => <br></br>,
          }) as string
        }
      </Typography>

      {!consented ? (
        <Link
          component='button'
          type='button'
          underline='always'
          onClick={handleEnable}
          fontWeight={600}
          fontSize={'14px'}
          sx={{
            color: palette.primary.main,
            cursor: 'pointer',
            ml: '16px',
            mb: '30px',
          }}
        >
          {t('consent_banner.cta_enable')}
        </Link>
      ) : (
        <Box
          sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: '30px' }}
        >
          <Typography
            variant='body2'
            color={palette.primary.main}
            fontWeight={500}
            ml={'16px'}
          >
            {t('consent_banner.cta_given')}
          </Typography>
          <CheckIcon sx={{ fontSize: 16, color: palette.primary.main }} />
        </Box>
      )}
    </GenericAlertBanner>
  );
};

export default LiveWebinarWarningBanner;

'use client';
import React, { useState } from 'react';
import {
  Alert,
  Box,
  IconButton,
  Link,
  Typography,
  useTheme,
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import { useTranslations } from 'next-intl';

type LiveWebinarWarningBannerProps = {
  onEnableConsent: () => null;
};

const LiveWebinarWarningBanner = ({
  onEnableConsent,
}: LiveWebinarWarningBannerProps) => {
  const [visible, setVisible] = useState(true);
  const [consented, setConsented] = useState(false);
  const t = useTranslations('webinar');
  const { palette } = useTheme();

  if (!visible) return null;

  const handleEnable = () => {
    setConsented(true);
    onEnableConsent();
  };

  return (
    <Alert
      severity='warning'
      icon={false}
      sx={{
        mt: '64px',
        mb: '32px',
        width: '100%',
        backgroundColor: palette.primaryAction.selected,
        border: `1px solid ${palette.primaryAction.hover}`,
        borderRadius: 2,
        '& .MuiAlert-message': {
          width: '100%',
          p: 0,
        },
        '& .MuiAlert-action': {
          height: '100%',
          alignSelf: 'flex-start',
          p: 0,
        },
      }}
      action={
        <IconButton
          aria-label='close'
          size='small'
          onClick={() => setVisible(false)}
          sx={{ color: palette.text.secondary }}
        >
          <CloseIcon fontSize='small' />
        </IconButton>
      }
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          mt: '8px',
          mb: 1,
          ml: '16px',
        }}
      >
        <ReportProblemIcon
          width={'22px'}
          sx={{ color: palette.primary.main }}
        />
        <Typography
          fontSize={'16px'}
          fontWeight={600}
          color={palette.text.primary}
        >
          {t('consent_banner.title')}
        </Typography>
      </Box>

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
    </Alert>
  );
};

export default LiveWebinarWarningBanner;

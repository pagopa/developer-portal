import RecordVoiceOverIcon from '@mui/icons-material/RecordVoiceOver';
import { Box, Typography, useTheme } from '@mui/material';
import React from 'react';
import { useTranslations } from 'next-intl';

const LiveWebinarChip = () => {
  const { palette } = useTheme();
  const t = useTranslations('webinar');

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
      }}
    >
      <RecordVoiceOverIcon
        fontSize={'small'}
        sx={{ marginRight: 1, color: palette.text.primary }}
      />
      <Typography
        variant='caption'
        sx={{
          textTransform: 'uppercase',
          fontWeight: 600,
          fontSize: '14px',
          color: palette.common.white,
          backgroundColor: palette.text.primary,
          paddingX: 1,
          paddingY: 0.5,
          borderRadius: 1,
        }}
      >
        {t('liveWebinar')}
      </Typography>
    </Box>
  );
};

export default LiveWebinarChip;

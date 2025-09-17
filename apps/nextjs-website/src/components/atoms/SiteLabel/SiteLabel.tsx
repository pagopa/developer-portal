'use client';
import { Box, Typography, useTheme } from '@mui/material';
import React from 'react';

type SiteLabelProps = {
  readonly title: string;
  readonly boldTitle: string;
  readonly color?: string;
};

const SiteLabel = ({ title, boldTitle, color }: SiteLabelProps) => {
  const { palette } = useTheme();

  return (
    <Typography
      color={color || palette.common.white}
      component={'p'}
      sx={{ height: '30px' }}
    >
      {title}
      <Box component={'span'} fontWeight={'bold'} sx={{ pl: 0.8, pr: 1.6 }}>
        {boldTitle}
      </Box>
    </Typography>
  );
};

export default SiteLabel;

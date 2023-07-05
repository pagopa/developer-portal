import { Box, Typography } from '@mui/material';
import React from 'react';

type SiteLabelProps = {
  readonly title: string;
  readonly boldTitle: string;
  readonly color?: string;
};

const SiteLabel = ({ title, boldTitle, color }: SiteLabelProps) => {
  return (
    <Typography color={color} component={'p'}>
      {title}
      <Box component={'span'} fontWeight={'bold'} sx={{ pl: 0.8, pr: 1.6 }}>
        {boldTitle}
      </Box>
    </Typography>
  );
};

export default SiteLabel;

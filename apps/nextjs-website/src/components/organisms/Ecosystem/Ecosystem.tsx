'use client';
import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import TabComponent, {
  TabItem,
} from '@/components/atoms/TabComponent/TabComponent';

type EcosystemProps = {
  title?: string;
  backgroundColor?: string;
  items: ReadonlyArray<TabItem>;
};

const Ecosystem = ({ title, backgroundColor, items }: EcosystemProps) => {
  const theme = useTheme();
  return (
    <Box
      pt={10}
      pb={0}
      sx={{ backgroundColor: backgroundColor || theme.palette.grey[50] }}
    >
      <Box sx={{ maxWidth: '1200px', margin: 'auto' }}>
        {title && (
          <Typography variant='h4' sx={{ mb: 4, width: '100%' }}>
            {title}
          </Typography>
        )}
        <TabComponent
          items={items}
          variant='fullWidth'
          centered
          sx={{ px: 0 }}
        />
      </Box>
    </Box>
  );
};

export default Ecosystem;

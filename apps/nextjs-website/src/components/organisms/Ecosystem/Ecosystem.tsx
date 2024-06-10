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
      pt={5}
      pb={0}
      sx={{ backgroundColor: backgroundColor || theme.palette.grey[50] }}
    >
      <Box sx={{ maxWidth: '1200px', margin: 'auto' }}>
        {title && (
          <Typography
            variant='h4'
            style={{ marginBottom: '16px', width: '100%' }}
          >
            {title}
          </Typography>
        )}
        <TabComponent items={items} variant='fullWidth' centered px={0} />
      </Box>
    </Box>
  );
};

export default Ecosystem;

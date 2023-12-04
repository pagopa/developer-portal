'use client';

import { Stack, Typography } from '@mui/material';
import { ReactNode } from 'react';

export type InfoCardItemProps = {
  title: string;
  value?: string;
  valueFallback?: ReactNode;
};

export const InfoCardItem = ({
  title,
  value,
  valueFallback,
}: InfoCardItemProps) => {
  return (
    <Stack my={{ xs: 1, md: 3 }} flexDirection={{ xs: 'column', md: 'row' }}>
      <Typography
        variant='body2'
        fontSize={16}
        minWidth={{ xs: 'auto', md: '200px' }}
      >
        {title}
      </Typography>
      {value ? (
        <Typography
          minHeight={'24px'}
          fontSize={16}
          flexGrow={1}
          fontWeight={700}
        >
          {value}
        </Typography>
      ) : (
        valueFallback
      )}
    </Stack>
  );
};

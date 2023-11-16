'use client';

import { Stack, Typography } from '@mui/material';

export type InfoCardItemProps = {
  title: string;
  value?: string;
};

export const InfoCardItem = ({ title, value }: InfoCardItemProps) => {
  return (
    <Stack my={{ xs: 1, md: 3 }} flexDirection={{ xs: 'column', md: 'row' }}>
      <Typography fontSize={16} minWidth={{ xs: 'auto', md: '200px' }}>
        {title}
      </Typography>
      <Typography
        minHeight={'24px'}
        fontSize={16}
        flexGrow={1}
        fontWeight={700}
      >
        {value}
      </Typography>
    </Stack>
  );
};

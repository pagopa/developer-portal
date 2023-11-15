'use client';
import EContainer from '@/editorialComponents/EContainer/EContainer';
import { Stack, Typography } from '@mui/material';
import React, { ReactNode } from 'react';

export type SubscribeCtaProps = {
  readonly label: string;
  readonly children?: ReactNode | ReactNode[];
};

const SubscribeCta = ({ label, children }: SubscribeCtaProps) => {
  return (
    <EContainer>
      <Stack
        py={5}
        flexGrow={1}
        alignItems='start'
        direction='column'
        gap={3}
        justifyContent='flex-start'
      >
        <Typography variant='body1' fontWeight={600} style={{ marginTop: 0 }}>
          {label}
        </Typography>
        {children}
      </Stack>
    </EContainer>
  );
};

export default SubscribeCta;

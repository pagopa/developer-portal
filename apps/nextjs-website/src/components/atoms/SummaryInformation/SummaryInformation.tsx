'use client';
import React, { FC } from 'react';
import { SxProps, Theme, Typography, useTheme, Stack } from '@mui/material';
import { Variant } from '@mui/material/styles/createTypography';

export type SummaryInformationProps = {
  date: string;
  title: string;
  description: string;
  ctaComponent?: React.ReactNode;
};

const SummaryInformation: FC<SummaryInformationProps> = ({
  date,
  title,
  description,
  ctaComponent,
}) => {
  const { palette } = useTheme();

  return (
    <Stack
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'start',
        alignContent: 'flex-start',
      }}
    >
      <Typography
        variant='caption'
        style={{ fontWeight: 900, color: palette.grey[600] }}
      >
        {date}
      </Typography>
      <Typography variant='h5' style={{ marginBottom: 16 }}>
        {title}
      </Typography>
      <Typography variant='body1'>{description}</Typography>
      {ctaComponent}
    </Stack>
  );
};

export default SummaryInformation;

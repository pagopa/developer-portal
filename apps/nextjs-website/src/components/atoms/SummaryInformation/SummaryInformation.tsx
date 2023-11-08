'use client';
import React, { FC } from 'react';
import { SxProps, Theme, Typography, useTheme, Stack } from '@mui/material';
import { Variant } from '@mui/material/styles/createTypography';
import TimeSlot from '../TimeSlot/TimeSlot';

export type SummaryInformationProps = {
  date: Date;
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
        paddingLeft: 8,
        paddingRight: 8,
        paddingTop: 4,
        paddingBottom: 4,
      }}
    >
      <Typography
        variant='caption'
        style={{ fontWeight: 900, color: palette.grey[600] }}
      >
        <TimeSlot start={date}></TimeSlot>
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

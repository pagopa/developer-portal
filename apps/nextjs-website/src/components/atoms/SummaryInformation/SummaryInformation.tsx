'use client';
import React, { FC } from 'react';
import { Typography, useTheme, Stack } from '@mui/material';
import TimeSlot from '../TimeSlot/TimeSlot';
import EContainer from '@/editorialComponents/EContainer/EContainer';

export type SummaryInformationProps = {
  startDateTime?: Date;
  endDateTime?: Date;
  title: string;
  description: string;
  children?: React.ReactNode | React.ReactNode[];
};

const SummaryInformation: FC<SummaryInformationProps> = ({
  startDateTime,
  endDateTime,
  title,
  description,
  children,
}) => {
  const { palette } = useTheme();

  return (
    <EContainer>
      <Stack
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'start',
          alignContent: 'flex-start',
          paddingTop: 10,
          paddingBottom: 10,
        }}
      >
        <Typography
          variant='caption'
          style={{ fontWeight: 900, color: palette.grey[600] }}
        >
          <TimeSlot start={startDateTime} end={endDateTime} />
        </Typography>
        <Typography variant='h5' style={{ marginTop: 16, marginBottom: 32 }}>
          {title}
        </Typography>
        <Typography variant='body1'>{description}</Typography>
        {children}
      </Stack>
    </EContainer>
  );
};

export default SummaryInformation;

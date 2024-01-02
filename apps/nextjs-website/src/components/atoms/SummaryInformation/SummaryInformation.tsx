'use client';
import React, { FC } from 'react';
import { Stack, Typography, useTheme } from '@mui/material';
import TimeSlot from '../TimeSlot/TimeSlot';
import EContainer from '@/editorialComponents/EContainer/EContainer';
import LiveWebinarChip from '@/components/atoms/LiveWebinarChip/LiveWebinarChip';
import { WebinarState } from '@/helpers/webinar.helpers';

export type SummaryInformationProps = {
  startDateTime?: string;
  endDateTime?: string;
  title: string;
  description: string;
  webinarState: WebinarState;
  children?: React.ReactNode | React.ReactNode[];
};

const SummaryInformation: FC<SummaryInformationProps> = ({
  startDateTime,
  endDateTime,
  title,
  description,
  webinarState,
  children,
}) => {
  const { palette } = useTheme();

  return (
    <div style={{ backgroundColor: palette.grey[50] }}>
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
            {webinarState === WebinarState.live && <LiveWebinarChip />}
            {![
              WebinarState.unknown,
              WebinarState.live,
              WebinarState.past,
            ].includes(webinarState) && (
              <TimeSlot start={startDateTime} end={endDateTime} />
            )}
          </Typography>
          <Typography variant='h5' style={{ marginTop: 16, marginBottom: 32 }}>
            {title}
          </Typography>
          <Typography variant='body1'>{description}</Typography>
          {children}
        </Stack>
      </EContainer>
    </div>
  );
};

export default SummaryInformation;

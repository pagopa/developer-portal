'use client';
import React, { FC, useMemo } from 'react';
import { Stack, Typography, useMediaQuery, useTheme } from '@mui/material';
import TimeSlot from '../TimeSlot/TimeSlot';
import EContainer from '@/editorialComponents/EContainer/EContainer';
import LiveWebinarChip from '@/components/atoms/LiveWebinarChip/LiveWebinarChip';
import { WebinarState } from '@/helpers/webinar.helpers';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

export type SummaryInformationProps = {
  startDateTime?: string;
  endDateTime?: string;
  title: string;
  description: string;
  webinarState: WebinarState;
  children?: React.ReactNode | React.ReactNode[];
  textColor?: string;
};

const SummaryInformation: FC<SummaryInformationProps> = ({
  startDateTime,
  endDateTime,
  title,
  description,
  webinarState,
  children,
  textColor,
}) => {
  const { palette } = useTheme();
  const isSmallScreen = useMediaQuery('(max-width: 1000px)');
  const showTimeSlot = useMemo(
    () => !isSmallScreen && startDateTime && endDateTime,
    [isSmallScreen, startDateTime, endDateTime]
  );

  return (
    <div>
      <EContainer>
        <Stack
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'start',
            alignContent: 'flex-start',
            paddingTop: 10,
            paddingBottom: 10,
            width: '100%',
          }}
        >
          {showTimeSlot ? (
            <Stack
              direction={'row'}
              sx={{ alignContent: 'center', gap: '8px' }}
            >
              <CalendarTodayIcon
                sx={{
                  color: textColor || palette.text.primary,
                  width: '24px',
                  height: '24px',
                  alignSelf: 'center',
                }}
              />
              <Typography
                variant='caption'
                style={{
                  fontWeight: 700,
                  fontSize: '24px',
                  color: textColor || palette.grey[600],
                }}
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
            </Stack>
          ) : null}
          <Typography
            style={{
              fontWeight: 700,
              fontStyle: 'bold',
              fontSize: '38px',
              marginTop: 16,
              marginBottom: 32,
              color: textColor || palette.text.primary,
            }}
          >
            {title}
          </Typography>
          <Typography
            sx={{
              fontWeight: '400',
              fontSize: '18px',
              color: textColor || palette.text.secondary,
            }}
          >
            {description}
          </Typography>
          {children}
        </Stack>
      </EContainer>
    </div>
  );
};

export default SummaryInformation;

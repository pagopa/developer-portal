'use client';
import React, { FC } from 'react';
import { Box, Stack, Typography, useMediaQuery, useTheme } from '@mui/material';
import TimeSlot from '../TimeSlot/TimeSlot';
import EContainer from '@/editorialComponents/EContainer/EContainer';
import LiveWebinarChip from '@/components/atoms/LiveWebinarChip/LiveWebinarChip';
import { WebinarState } from '@/helpers/webinar.helpers';
import { webinarDateOptions } from '@/config';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { useFormatter } from 'next-intl';

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
  const format = useFormatter();
  const isSmallScreen = useMediaQuery('(max-width: 1000px)');
  const showTimeSlot =
    startDateTime &&
    endDateTime &&
    [WebinarState.future, WebinarState.comingSoon].includes(webinarState);
  const showDateTag = endDateTime && webinarState === WebinarState.past;

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
          {webinarState === WebinarState.live && <LiveWebinarChip />}
          {showTimeSlot && (
            <Stack
              direction={'row'}
              sx={{ alignContent: 'center', gap: '8px' }}
            >
              <CalendarTodayIcon
                sx={{
                  color: textColor || palette.text.primary,
                  width: '24px',
                  height: '24px',
                  alignSelf: isSmallScreen ? 'start' : 'center',
                }}
              />
              <Typography
                variant='caption'
                style={{
                  fontWeight: 700,
                  fontSize: isSmallScreen ? '18px' : '24px',
                  color: textColor || palette.grey[600],
                }}
              >
                <TimeSlot start={startDateTime} end={endDateTime} />
              </Typography>
            </Stack>
          )}
          {showDateTag && (
            <Stack
              direction={'row'}
              sx={{ alignContent: 'center', gap: '8px' }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor: palette.grey[200],
                  padding: 0.5,
                  borderRadius: '4px',
                }}
              >
                <Typography
                  variant='caption'
                  style={{
                    fontWeight: 600,
                    fontSize: '14px',
                    color: textColor || palette.grey[600],
                  }}
                >
                  {format.dateTime(new Date(endDateTime), webinarDateOptions)}
                </Typography>
              </Box>
            </Stack>
          )}
          <Typography
            style={{
              fontWeight: 700,
              fontStyle: 'bold',
              fontSize: isSmallScreen ? '32px' : '38px',
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

'use client';
import { Webinar } from '@/lib/types/webinar';
import { Box, Card, CardContent, Typography, useTheme } from '@mui/material';
import React from 'react';
import LinkButton from '@/components/atoms/LinkButton/LinkButton';
import { translations } from '@/_contents/translations';
import SpeakerPreview from '@/components/molecules/SpeakerPreview/SpeakerPreview';
import TimeSlot from '@/components/atoms/TimeSlot/TimeSlot';

type WebinarCardProps = { children?: React.ReactNode } & Webinar;

const WebinarCard = ({
  title,
  description,
  path,
  speakers,
  startDateTime,
  endDateTime,
  children,
}: WebinarCardProps) => {
  const theme = useTheme();
  const { webinar } = translations;

  return (
    <Card
      style={{
        flexDirection: 'column',
        display: 'flex',
        justifyContent: 'space-between',
        height: '100%',
        overflow: 'visible',
      }}
    >
      <CardContent
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          justifyContent: 'left',
          gap: '56px',
        }}
      >
        <Box width={{ md: '55%' }}>
          <Typography fontSize={18} fontWeight={600}>
            <TimeSlot start={startDateTime} end={endDateTime} />
          </Typography>
          <Typography variant='h6' mt={2} gutterBottom>
            {title}
          </Typography>
          <Typography variant='body2' mb={1}>
            {description}
          </Typography>
          <LinkButton
            disabled={false}
            href={path}
            label={webinar.whyParticipate}
            color={theme.palette.primary.main}
          />
          <Box mt={4}>{children}</Box>
        </Box>
        {speakers && (
          <Box>
            <Typography
              mb={2}
              color={theme.palette.text.primary}
              fontSize={18}
              fontWeight={600}
              textTransform={'uppercase'}
            >
              {webinar.speakers}
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {speakers.map((speaker, index) => (
                <SpeakerPreview
                  key={index}
                  name={speaker.name}
                  description={speaker.description}
                  jobTitle={speaker.jobTitle}
                  imagePath={speaker.imagePath}
                />
              ))}
            </Box>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default WebinarCard;

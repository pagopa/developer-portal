'use client';
import { Webinar } from '@/lib/types/webinar';
import { Box, Card, CardContent, Typography, useTheme } from '@mui/material';
import React from 'react';
import LinkButton from '@/components/atoms/LinkButton/LinkButton';
import { translations } from '@/_contents/translations';
import { format } from 'date-fns';
import { ButtonNaked } from '@pagopa/mui-italia';
import Link from 'next/link';
import SpeakerPreview from '@/components/molecules/SpeakerPreview/SpeakerPreview';

type WebinarCardProps = Webinar;

const WebinarCard = ({
  title,
  description,
  path,
  speakers,
  startDateTime,
  endDateTime,
}: WebinarCardProps) => {
  const theme = useTheme();
  const { webinar } = translations;

  const timeSlot: string =
    (startDateTime
      ? format(new Date(startDateTime), 'd MMMM yyyy, HH:mm')
      : '') +
    ' - ' +
    (endDateTime ? format(new Date(endDateTime), 'HH:mm') : '');

  return (
    <Card
      style={{
        flexDirection: 'column',
        display: 'flex',
        justifyContent: 'space-between',
        height: '100%',
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
        <Box width='55%'>
          <Typography fontSize={18} fontWeight={600}>
            {timeSlot}
          </Typography>
          <Typography variant='h6' mt={2} gutterBottom>
            {title}
          </Typography>
          <Typography variant='body2' mb={1}>
            {description}
          </Typography>
          <LinkButton
            disabled={false}
            href={'#'}
            label={webinar.whyParticipate}
            color={theme.palette.primary.main}
          />
          <Box mt={4}>
            <ButtonNaked
              component={Link}
              href={path}
              color={'primary'}
              variant={'contained'}
            >
              {webinar.subscribe}
            </ButtonNaked>
          </Box>
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

'use client';
import { Webinar } from '@/lib/types/webinar';
import { Box, Card, CardContent, Typography, useTheme } from '@mui/material';
import React, { useState } from 'react';
import LinkButton from '@/components/atoms/LinkButton/LinkButton';
import { translations } from '@/_contents/translations';
import SpeakerPreview from '@/components/molecules/SpeakerPreview/SpeakerPreview';
import TimeSlot from '@/components/atoms/TimeSlot/TimeSlot';
import SubscribeToWebinar from '../SubscribeToWebinar/SubscribeToWebinar';
import { DevPortalUser } from '@/lib/types/auth';
import { useUser } from '@/helpers/user.helper';

type WebinarCardProps = {
  userAligned?: boolean;
  handleErrorMessage?: (message: string) => null;
} & Webinar;

const WebinarCard = ({
  title,
  description,
  slug,
  speakers,
  startDateTime,
  endDateTime,
  userAligned,
  handleErrorMessage,
}: WebinarCardProps) => {
  const theme = useTheme();
  const { webinar } = translations;
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { user, setUserAttributes } = useUser();

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
            href={`/webinars/${slug}`}
            label={webinar.whyParticipate}
            color={theme.palette.primary.main}
          />
          <Box mt={4}>
            <SubscribeToWebinar
              webinarSlug={slug}
              userAttributes={user?.attributes}
              userAligned={userAligned}
              setUserAttributes={async (
                attributes: DevPortalUser['attributes']
              ) => {
                await setUserAttributes(attributes);
                return null;
              }}
              isSubscribed={isSubscribed}
              setIsSubscribed={(bool: boolean) => {
                setIsSubscribed(bool);
                return null;
              }}
              handleErrorMessage={handleErrorMessage}
            />
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

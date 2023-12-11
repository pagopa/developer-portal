'use client';
import { Webinar } from '@/lib/types/webinar';
import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';
import LinkButton from '@/components/atoms/LinkButton/LinkButton';
import SpeakerPreview from '@/components/molecules/SpeakerPreview/SpeakerPreview';
import TimeSlot from '@/components/atoms/TimeSlot/TimeSlot';
import SubscribeToWebinar from '../SubscribeToWebinar/SubscribeToWebinar';
import { DevPortalUser } from '@/lib/types/auth';
import { useUser } from '@/helpers/user.helper';
import { useTranslations } from 'next-intl';
import { useWebinar, WebinarState } from '@/helpers/webinar.helpers';
import LiveWebinarChip from '@/components/atoms/LiveWebinarChip/LiveWebinarChip';

type WebinarCardProps = {
  webinar: Webinar;
  userAligned?: boolean;
  handleErrorMessage?: (message: string) => null;
};

const WebinarCard = ({
  webinar,
  userAligned,
  handleErrorMessage,
}: WebinarCardProps) => {
  const theme = useTheme();
  const t = useTranslations('webinar');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { user, setUserAttributes } = useUser();

  const { webinarState, setWebinar } = useWebinar();

  useEffect(() => {
    webinar && setWebinar(webinar);
  }, [webinar]);

  return (
    <Card
      style={{
        flexDirection: 'column',
        display: 'flex',
        justifyContent: 'space-between',
        height: '100%',
        overflow: 'visible',
        position: 'relative',
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
          {webinarState === WebinarState.live && <LiveWebinarChip />}
          {![
            WebinarState.unknown,
            WebinarState.live,
            WebinarState.past,
          ].includes(webinarState) && (
            <Typography fontSize={18} fontWeight={600}>
              <TimeSlot
                start={webinar.startDateTime}
                end={webinar.endDateTime}
              />
            </Typography>
          )}
          <Typography variant='h6' mt={2} gutterBottom>
            {webinar.title}
          </Typography>
          <Typography variant='body2' mb={1}>
            {webinar.description}
          </Typography>
          <LinkButton
            disabled={false}
            href={`/webinars/${webinar.slug}`}
            label={t('whyParticipate')}
            color={theme.palette.primary.main}
          />
          <Box mt={4}>
            <SubscribeToWebinar
              webinarSlug={webinar.slug}
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
              webinarState={webinarState}
            />
          </Box>
          {isSubscribed && webinarState === WebinarState.future && (
            <Typography
              variant={'body2'}
              sx={{
                position: 'absolute',
                bottom: '24px',
                fontSize: '12px',
                marginTop: 1,
              }}
            >
              {t('warnings.email')}
            </Typography>
          )}
          {isSubscribed && webinarState === WebinarState.comingSoon && (
            <Typography
              variant={'body2'}
              sx={{
                position: 'absolute',
                bottom: '24px',
                fontSize: '12px',
                marginTop: 1,
              }}
            >
              {t('warnings.goTo')}
            </Typography>
          )}
        </Box>
        {webinar.speakers && (
          <Box>
            <Typography
              mb={2}
              color={theme.palette.text.primary}
              fontSize={18}
              fontWeight={600}
              textTransform={'uppercase'}
            >
              {t('speakers')}
            </Typography>
            <Stack direction='column' gap={2}>
              {webinar.speakers.map((speaker, index) => (
                <SpeakerPreview
                  key={index}
                  name={speaker.name}
                  description={speaker.description}
                  jobTitle={speaker.jobTitle}
                  imagePath={speaker.imagePath}
                />
              ))}
            </Stack>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default WebinarCard;

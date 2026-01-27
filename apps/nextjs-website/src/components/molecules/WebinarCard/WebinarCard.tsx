'use client';
import { Webinar } from '@/lib/types/webinar';
import React, { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import LinkButton from '@/components/atoms/LinkButton/LinkButton';
import SpeakerPreview from '@/components/molecules/SpeakerPreview/SpeakerPreview';
import TimeSlot from '@/components/atoms/TimeSlot/TimeSlot';
import SubscribeToWebinar from '../SubscribeToWebinar/SubscribeToWebinar';
import { useTranslations } from 'next-intl';
import { useWebinar, WebinarState } from '@/helpers/webinar.helpers';
import LiveWebinarChip from '@/components/atoms/LiveWebinarChip/LiveWebinarChip';
import { useRouter } from 'next/navigation';

type WebinarCardProps = {
  webinar: Webinar;
  handleErrorMessage?: (message: string) => null;
  textColor?: string;
};

const WebinarCard = ({
  webinar,
  handleErrorMessage,
  textColor,
}: WebinarCardProps) => {
  const theme = useTheme();
  const router = useRouter();
  const t = useTranslations('webinar');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const isSmallScreen = useMediaQuery('(max-width: 1000px)');
  const { webinarState, setWebinar } = useWebinar();

  useEffect(() => {
    if (webinar) {
      setWebinar(webinar);
    }
  }, [webinar, setWebinar]);

  const linkButton: React.ReactNode = useMemo(() => {
    if ([WebinarState.unknown, WebinarState.past].includes(webinarState)) {
      return null;
    }

    return (
      <LinkButton
        disabled={false}
        href={`/webinars/${webinar.slug}`}
        label={t(isSubscribed ? 'goToWebinar' : 'whyParticipate')}
        color={theme.palette.primary.main}
      />
    );
  }, [isSubscribed, webinarState, webinar.slug, t, theme.palette.primary.main]);

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
          {linkButton}
          <Box my={4}>
            {isSubscribed &&
            (webinarState === WebinarState.live ||
              webinarState === WebinarState.past) ? (
              <Box mt={4} display={'flex'} flexDirection={'row'} gap={2}>
                <Button
                  variant={'contained'}
                  onClick={() => {
                    // eslint-disable-next-line functional/immutable-data
                    router.push(`/webinars/${webinar.slug}`);
                    return null;
                  }}
                >
                  {t('view')}
                </Button>
              </Box>
            ) : (
              <SubscribeToWebinar
                webinarSlug={webinar.slug}
                isSubscribed={isSubscribed}
                setIsSubscribed={(bool: boolean) => {
                  setIsSubscribed(bool);
                  return null;
                }}
                handleErrorMessage={handleErrorMessage}
                webinarState={webinarState}
                textColor={textColor}
              />
            )}
          </Box>
          {isSubscribed && webinarState === WebinarState.future && (
            <Typography
              variant={'body2'}
              sx={{
                position: isSmallScreen ? 'relative' : 'absolute',
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
                position: isSmallScreen ? 'relative' : 'absolute',
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
          <Box width={{ md: '45%' }}>
            <Typography
              my={2}
              color={theme.palette.text.primary}
              fontSize={14}
              fontWeight={700}
              textTransform={'uppercase'}
            >
              {t('speakers')}
            </Typography>
            <Stack width='100%' direction='column' gap={2}>
              {webinar.speakers.map((speaker, index) => (
                <SpeakerPreview
                  key={index}
                  name={speaker.name}
                  description={speaker.description}
                  jobTitle={speaker.jobTitle}
                  avatar={speaker.avatar}
                  flexDirection='row'
                  compactMode={true}
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

import { Box, Grid, Stack, Typography } from '@mui/material';
import Image from 'next/image';
import LinkButton from '@/components/atoms/LinkButton/LinkButton';
import React from 'react';
import { Webinar } from '@/lib/types/webinar';
import { useTranslations } from 'next-intl';
import { defaultLocale, dateOptions } from '@/config';

type WebinarListItemProps = {
  webinar: Webinar;
};

const WebinarListItem = ({ webinar }: WebinarListItemProps) => {
  const t = useTranslations();

  return (
    <Grid
      item
      xs={12}
      sm={6}
      md={4}
      mb={6}
      minWidth={{ xs: '80vw', sm: 'auto' }}
    >
      <Box position={'relative'} sx={{ overflow: 'hidden' }}>
        <Image
          src={webinar.imagePath}
          alt={webinar.title}
          width={0}
          height={0}
          sizes='100vw'
          style={{
            borderRadius: 16,
            width: '100%',
            height: 'auto',
          }}
        />
      </Box>
      {webinar.startDateTime && (
        <Typography
          color='text.secondary'
          fontSize={16}
          fontWeight={400}
          my={2}
        >
          {new Date(webinar.startDateTime).toLocaleDateString(
            defaultLocale,
            dateOptions
          )}
        </Typography>
      )}
      <Typography variant='h6'>{webinar.title}</Typography>
      <Stack mt={2} direction='row' alignItems='center' color='primary.main'>
        <LinkButton
          href={`/webinars/${webinar.slug}`}
          label={t('webinar.goToWebinar')}
        />
      </Stack>
    </Grid>
  );
};

export default WebinarListItem;

'use client';
import React, { ReactNode } from 'react';
import Hero from '@/editorialComponents/Hero/Hero';
import { useTranslations } from 'next-intl';
import { Box, Grid, Stack, Typography, useTheme } from '@mui/material';
import dynamic from 'next/dynamic';
import { Webinar } from '@/lib/types/webinar';
import EContainer from '@/editorialComponents/EContainer/EContainer';
import Image from 'next/image';
import LinkButton from '@/components/atoms/LinkButton/LinkButton';
import SectionTitle from '@/components/molecules/SectionTitle/SectionTitle';

type WebinarsLayoutProps = {
  children?: ReactNode | ReactNode[];
  visibleInHomeWebinars: readonly Webinar[];
  otherWebinars: readonly Webinar[];
};

const NotSsrWebinarsSection = dynamic(
  () => import('@/components/organisms/WebinarsSection/WebinarsSection'),
  { ssr: false }
);

const WebinarsLayout = ({
  children,
  visibleInHomeWebinars,
  otherWebinars,
}: WebinarsLayoutProps) => {
  const t = useTranslations();
  const { palette } = useTheme();
  const dateOptions: {
    date?: Date;
    locale?: string;
    options?: Intl.DateTimeFormatOptions;
  } = {
    locale: 'it-IT',
    options: {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    },
  };

  return (
    <>
      <Hero
        background={palette.background.paper}
        title={t('webinars.title')}
        subtitle={t('webinars.subtitle')}
        size='small'
        smallHeight={'308px'}
        useHoverlay={false}
        theme='light'
      />
      <NotSsrWebinarsSection webinars={[...visibleInHomeWebinars]} />
      {children}
      <Box pt={8} pb={2}>
        <SectionTitle title={t('webinars.pastWebinars')} />
      </Box>
      <EContainer
        background={palette.background.paper}
        sx={{ paddingTop: 4, paddingBottom: 8 }}
      >
        <Grid item md={12}>
          <Grid container spacing={4}>
            {otherWebinars.map((webinar, i) => (
              <Grid
                key={i}
                item
                sm={12}
                md={4}
                mb={6}
                minWidth={{ xs: '80vw', md: 'auto' }}
              >
                <Box position={'relative'} sx={{ overflow: 'hidden' }}>
                  <Image
                    src={webinar.imagePath ?? '/images/webinar-default.png'}
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
                    {new Intl.DateTimeFormat(dateOptions.locale, {}).format(
                      new Date(webinar.startDateTime).getTime()
                    )}
                  </Typography>
                )}
                <Typography variant='h6'>{webinar.title}</Typography>
                <Stack
                  mt={2}
                  direction='row'
                  alignItems='center'
                  color='primary.main'
                >
                  <LinkButton
                    href={webinar.slug}
                    label={t('webinar.goToWebinar')}
                  />
                </Stack>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </EContainer>
    </>
  );
};

export default WebinarsLayout;

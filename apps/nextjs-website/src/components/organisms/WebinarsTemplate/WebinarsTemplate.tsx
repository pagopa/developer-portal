'use client';
import React, { useCallback, useEffect, useState } from 'react';
import Hero from '@/editorialComponents/Hero/Hero';
import { useTranslations } from 'next-intl';
import { Box, Grid, useTheme } from '@mui/material';
import { Webinar } from '@/lib/types/webinar';
import EContainer from '@/editorialComponents/EContainer/EContainer';
import SectionTitle from '@/components/molecules/SectionTitle/SectionTitle';
import WebinarsSection from '@/components/organisms/WebinarsSection/WebinarsSection';
import WebinarListItem from '@/components/molecules/WebinarListItem/WebinarListItem';

const CHECK_WEBINARS_INTERVAL_MS = 60 * 1000;

type WebinarsTemplateProps = {
  webinars: readonly Webinar[];
};

const WebinarsTemplate = ({ webinars }: WebinarsTemplateProps) => {
  const t = useTranslations();
  const { palette } = useTheme();
  const [nextWebinars, setNextWebinars] = useState<Webinar[]>([]);
  const [pastWebinars, setPastWebinars] = useState<Webinar[]>([]);

  const getNextWebinars = useCallback(
    (currentWebinars: readonly Webinar[]) =>
      currentWebinars.filter(
        ({ startDateTime, endDateTime }) =>
          (!startDateTime && !endDateTime) ||
          (endDateTime &&
            new Date(endDateTime).getTime() > new Date().getTime())
      ),
    []
  );

  const getPastWebinars = useCallback(
    (currentWebinars: readonly Webinar[]) =>
      currentWebinars
        .filter(
          ({ endDateTime, startDateTime }) =>
            endDateTime &&
            startDateTime &&
            new Date(endDateTime).getTime() <= new Date().getTime()
        )
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        .sort((a, b) => (a.startDateTime! < b.startDateTime! ? 1 : -1)),
    []
  );

  useEffect(() => {
    setNextWebinars(getNextWebinars(webinars));
    setPastWebinars(getPastWebinars(webinars));

    const intervalId = setInterval(() => {
      setNextWebinars(getNextWebinars(webinars));
      setPastWebinars(getPastWebinars(webinars));
    }, CHECK_WEBINARS_INTERVAL_MS);

    // Cleanup the interval when the component is unmounted
    return () => clearInterval(intervalId);
  }, [webinars]);

  return (
    <>
      <Hero
        background={palette.background.paper}
        title={t('webinars.title')}
        subtitle={t('webinars.subtitle')}
        size='small'
        smallHeight={'408px'}
        useHoverlay={false}
        theme='light'
      />
      {nextWebinars && (
        <WebinarsSection title={'next'} webinars={[...nextWebinars]} />
      )}
      {pastWebinars.length > 0 && (
        <>
          <Box pt={8} pb={2}>
            <SectionTitle title={t('webinars.pastWebinars')} />
          </Box>
          <EContainer
            background={palette.background.paper}
            sx={{ paddingTop: 4, paddingBottom: 8 }}
          >
            <Grid item md={12}>
              <Grid container spacing={4}>
                {pastWebinars.map((webinar, i) => (
                  <WebinarListItem webinar={webinar} key={i} />
                ))}
              </Grid>
            </Grid>
          </EContainer>
        </>
      )}
    </>
  );
};

export default WebinarsTemplate;

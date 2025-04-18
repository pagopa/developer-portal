'use client';
import React, { useEffect, useState } from 'react';
import Hero from '@/editorialComponents/Hero/Hero';
import { useTranslations } from 'next-intl';
import { Box, Grid, useTheme } from '@mui/material';
import { Webinar } from '@/lib/types/webinar';
import EContainer from '@/editorialComponents/EContainer/EContainer';
import SectionTitle from '@/components/molecules/SectionTitle/SectionTitle';
import WebinarListItem from '@/components/molecules/WebinarListItem/WebinarListItem';
import { getFutureWebinars, getPastWebinars } from '@/helpers/webinars.helpers';
import FutureWebinarsShowcase from '../FutureWebinarsShowcase/FutureWebinarsShowcase';
import { baseUrl } from '@/config';
import { generateStructuredDataScripts } from '@/helpers/generateStructuredDataScripts.helpers';
import { getItemFromPaths } from '@/helpers/structuredData.helpers';

const CHECK_WEBINARS_INTERVAL_MS = 60 * 1000;

type WebinarsTemplateProps = {
  webinars: readonly Webinar[];
};

const WebinarsTemplate = ({ webinars }: WebinarsTemplateProps) => {
  const t = useTranslations();
  const { palette } = useTheme();
  const [futureWebinars, setFutureWebinars] = useState<readonly Webinar[]>([]);
  const [pastWebinars, setPastWebinars] = useState<readonly Webinar[]>([]);

  const webinarsListPageSEO = {
    metaTitle: t('webinars.title'),
    metaDescription: t('webinars.subtitle'),
    canonicalURL: `${baseUrl}/webinars`,
  };

  const structuredData = generateStructuredDataScripts({
    breadcrumbsItems: [
      {
        name: webinarsListPageSEO.metaTitle,
        item: getItemFromPaths(['webinars']),
      },
    ],
    seo: webinarsListPageSEO,
  });

  useEffect(() => {
    setFutureWebinars(getFutureWebinars(webinars));
    setPastWebinars(getPastWebinars(webinars));

    const intervalId = setInterval(() => {
      setFutureWebinars(getFutureWebinars(webinars));
      setPastWebinars(getPastWebinars(webinars));
    }, CHECK_WEBINARS_INTERVAL_MS);

    // Cleanup the interval when the component is unmounted
    return () => clearInterval(intervalId);
  }, [webinars]);

  return (
    <>
      {structuredData}
      <Hero
        background={palette.background.paper}
        title={t('webinars.title')}
        subtitle={t('webinars.subtitle')}
        size='small'
        smallHeight={'408px'}
        useHoverlay={false}
        theme='light'
      />
      {futureWebinars && (
        <FutureWebinarsShowcase webinars={[...futureWebinars]} />
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

'use client';
import React, { useEffect, useState, Suspense } from 'react';
import Hero from '@/editorialComponents/Hero/Hero';
import { useTranslations } from 'next-intl';
import { Box, useTheme } from '@mui/material';
import { Webinar } from '@/lib/types/webinar';
import {
  getFutureWebinarsFrom,
  getPastWebinarsFrom,
} from '@/helpers/webinars.helpers';
import FutureWebinarsShowcase from '../FutureWebinarsShowcase/FutureWebinarsShowcase';
import { baseUrl } from '@/config';
import { generateStructuredDataScripts } from '@/helpers/generateStructuredDataScripts.helpers';
import { getItemFromPaths } from '@/helpers/structuredData.helpers';
import Spinner from '@/components/atoms/Spinner/Spinner';
import { FilteredGridLayout } from '@/components/organisms/FilteredGridLayout/FilteredGridLayout';
import { Tag } from '@/lib/types/tag';
import { SITE_HEADER_HEIGHT } from '@/config';

const CHECK_WEBINARS_INTERVAL_MS = 60 * 1000;

type WebinarsTemplateProps = {
  locale: string;
  webinars: readonly Webinar[];
  categories: readonly Tag[];
};

const WebinarsTemplateContent = ({
  locale,
  webinars,
  categories,
}: WebinarsTemplateProps) => {
  const t = useTranslations();
  const { palette } = useTheme();
  const [futureWebinars, setFutureWebinars] = useState<readonly Webinar[]>([]);
  const [pastWebinars, setPastWebinars] = useState<readonly Webinar[]>([]);

  const webinarsListPageSEO = {
    metaTitle: t('webinars.title'),
    metaDescription: t('webinars.subtitle'),
    canonicalURL: `${baseUrl}/${locale}/webinars`,
  };

  const structuredData = generateStructuredDataScripts({
    breadcrumbsItems: [
      {
        name: webinarsListPageSEO.metaTitle,
        item: getItemFromPaths(locale, ['webinars']),
      },
    ],
    seo: webinarsListPageSEO,
  });
  useEffect(() => {
    setFutureWebinars(getFutureWebinarsFrom(webinars));
    setPastWebinars(getPastWebinarsFrom(webinars));

    const intervalId = setInterval(() => {
      setFutureWebinars(getFutureWebinarsFrom(webinars));
      setPastWebinars(getPastWebinarsFrom(webinars));
    }, CHECK_WEBINARS_INTERVAL_MS);

    // Cleanup the interval when the component is unmounted
    return () => clearInterval(intervalId);
  }, [webinars]);
  const mappedWebinars = pastWebinars.map((webinar) => ({
    tags: webinar.tag ? [webinar.tag] : [],
    title: webinar.title,
    date: {
      date: new Date(Date.parse(webinar.startDateTime || '')),
    },
    href: {
      label: t('webinar.goToWebinar'),
      link: `/${locale}/webinars/${webinar.slug}`,
    },
    img: {
      alt: webinar.title,
      src: webinar.imagePath || '/images/news.png',
    },
  }));

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
        <FilteredGridLayout
          items={mappedWebinars}
          tags={categories}
          enableFilters={true}
          noItemsMessageKey={'webinars.noWebinars'}
        />
      )}
    </>
  );
};

const WebinarsTemplate = (props: WebinarsTemplateProps) => {
  return (
    <Box
      sx={{
        marginTop: `${SITE_HEADER_HEIGHT}px`,
      }}
    >
      <Suspense fallback={<Spinner />}>
        <WebinarsTemplateContent {...props} />
      </Suspense>
    </Box>
  );
};

export default WebinarsTemplate;

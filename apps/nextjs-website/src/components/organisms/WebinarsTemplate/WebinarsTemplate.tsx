'use client';
import React, { useEffect, useState } from 'react';
import Hero from '@/editorialComponents/Hero/Hero';
import { useTranslations } from 'next-intl';
import { Box, Grid, useMediaQuery, useTheme } from '@mui/material';
import { Webinar } from '@/lib/types/webinar';
import EContainer from '@/editorialComponents/EContainer/EContainer';
import SectionTitle from '@/components/molecules/SectionTitle/SectionTitle';
import WebinarListItem from '@/components/molecules/WebinarListItem/WebinarListItem';
import { getFutureWebinars, getPastWebinars } from '@/helpers/webinars.helpers';
import FutureWebinarsShowcase from '../FutureWebinarsShowcase/FutureWebinarsShowcase';
import { baseUrl } from '@/config';
import { generateStructuredDataScripts } from '@/helpers/generateStructuredDataScripts.helpers';
import { getItemFromPaths } from '@/helpers/structuredData.helpers';
import MobileWebinarCategorySelector from '@/components/molecules/MobileWebinarCategorySelector/MobileWebinarCategorySelector';
import DesktopWebinarCategorySelector from '@/components/molecules/DesktopWebinarCategorySelector/DesktopWebinarCategorySelector';
import { WebinarCategory } from '@/lib/types/webinarCategory';
import { useSearchParams } from 'next/navigation';

const CHECK_WEBINARS_INTERVAL_MS = 60 * 1000;

type WebinarsTemplateProps = {
  webinars: readonly Webinar[];
  categories: readonly WebinarCategory[];
};

const WebinarsTemplate = ({ webinars, categories }: WebinarsTemplateProps) => {
  const t = useTranslations();
  const updatedCategories = [
    {
      name: t('webinars.all'),
      icon: {
        data: {
          attributes: {
            name: 'all.svg',
            alternativeText: '',
            caption: '',
            width: 32,
            height: 32,
            size: 32,
            ext: '.svg',
            mime: 'image/svg',
            url: ' icons/all.svg',
          },
        },
      },
    },
    ...categories,
  ];
  const { palette } = useTheme();
  const [futureWebinars, setFutureWebinars] = useState<readonly Webinar[]>([]);
  const [pastWebinars, setPastWebinars] = useState<readonly Webinar[]>([]);
  const searchParams = useSearchParams();
  const parsedCategory = parseInt(searchParams.get('category') || '0');
  const categoryValue = Math.max(
    0,
    Math.min(
      isNaN(parsedCategory) ? 0 : parsedCategory,
      updatedCategories.length - 1
    )
  );
  const [selectedCategory, setSelectedCategory] = useState(categoryValue);

  const filteredWebinars = pastWebinars.filter((cat) => {
    return (
      selectedCategory === 0 ||
      cat.webinarCategory?.name === updatedCategories[selectedCategory].name
    );
  });
  // eslint-disable-next-line functional/no-return-void
  const setSelectedWebinarCategory = (newCategory: number): void => {
    if (newCategory === selectedCategory) return;
    addQueryParam('category', `${newCategory}`);
    // eslint-disable-next-line functional/immutable-data
    //window.location.href = '#webinarsHeader';
    document
      .getElementById('webinarsHeader')
      ?.scrollIntoView({ behavior: 'smooth' });
    setSelectedCategory(newCategory);
  };

  const addQueryParam = (key: string, value: string) => {
    const url = new URL(window.location.href);
    url.searchParams.set(key, value);
    window.history.pushState({}, '', url.toString());
  };

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
  const isSmallScreen = useMediaQuery('(max-width: 1000px)');

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
          <Box
            pt={8}
            pb={2}
            id={'webinarsHeader'}
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <SectionTitle title={t('webinars.pastWebinars')} />
          </Box>
          {categories.length <= 0 ? null : isSmallScreen ? (
            <MobileWebinarCategorySelector
              selectedWebinarCategory={selectedCategory}
              setSelectedWebinarCategory={setSelectedWebinarCategory}
              webinarCategories={updatedCategories}
            />
          ) : (
            <DesktopWebinarCategorySelector
              selectedWebinarCategory={selectedCategory}
              setSelectedWebinarCategory={setSelectedWebinarCategory}
              webinarCategories={updatedCategories}
            />
          )}
          {filteredWebinars.length <= 0 ? (
            <Box
              pt={8}
              pb={2}
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <SectionTitle title={t('webinars.noWebinars')} />
            </Box>
          ) : (
            <EContainer
              background={palette.background.paper}
              sx={{ paddingTop: 4, paddingBottom: 8 }}
            >
              <Grid item md={12}>
                <Grid container spacing={4}>
                  {filteredWebinars.map((webinar, i) => (
                    <WebinarListItem webinar={webinar} key={i} />
                  ))}
                </Grid>
              </Grid>
            </EContainer>
          )}
        </>
      )}
    </>
  );
};

export default WebinarsTemplate;

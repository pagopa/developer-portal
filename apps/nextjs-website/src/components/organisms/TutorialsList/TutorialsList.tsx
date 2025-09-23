'use client';

import { Tag } from '@/lib/types/tag';
import Newsroom from '@/editorialComponents/Newsroom/Newsroom';
import { Box, useMediaQuery } from '@mui/material';
import React, { useState } from 'react';
import { Tutorial } from '@/lib/types/tutorialData';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import MobileFilterSelector from '@/components/molecules/MobileFilterSelector/MobileFilterSelector';
import DesktopFilterSelector from '@/components/molecules/DesktopFilterSelector/DesktopFilterSelector';
import SectionTitle from '@/components/molecules/SectionTitle/SectionTitle';

type TutorialsListProps = {
  readonly tutorials: readonly Tutorial[];
  readonly tags: readonly Tag[];
  readonly enableFilters?: boolean;
};

export const TutorialsList = ({
  tags,
  tutorials,
  enableFilters,
}: TutorialsListProps) => {
  const t = useTranslations();
  const updatedTags = [
    {
      name: t('overview.tutorial.all'),
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
            url: '/icons/all.svg',
          },
        },
      },
    },
    ...tags,
  ];
  const searchParams = useSearchParams();
  const parsedTag = parseInt(searchParams.get('tag') || '0');
  const tagValue = Math.max(
    0,
    Math.min(isNaN(parsedTag) ? 0 : parsedTag, updatedTags.length - 1)
  );
  const [selectedTag, setSelectedTag] = useState(tagValue);

  const filteredTutorials = tutorials.filter((tutorial) => {
    return (
      selectedTag === 0 ||
      tutorial.tags?.some((tag) => tag.name === updatedTags[selectedTag].name)
    );
  });
  // eslint-disable-next-line functional/no-return-void
  const setSelectedTagFilter = (newTag: number): void => {
    if (newTag === selectedTag) return;
    addQueryParam('tag', `${newTag}`);
    // eslint-disable-next-line functional/immutable-data
    //window.location.href = '#webinarsHeader';
    document
      .getElementById('chatbot-page-content')
      ?.scrollIntoView({ behavior: 'smooth' });
    setSelectedTag(newTag);
  };

  const addQueryParam = (key: string, value: string) => {
    const url = new URL(window.location.href);
    url.searchParams.set(key, value);
    window.history.pushState({}, '', url.toString());
  };
  const isSmallScreen = useMediaQuery('(max-width: 1000px)');
  return (
    <Box>
      <Box sx={{ paddingBottom: filteredTutorials.length > 0 ? '24px' : 0 }}>
        {enableFilters &&
          tags.length > 0 &&
          (isSmallScreen ? (
            <MobileFilterSelector
              selectedFilter={selectedTag}
              setSelectedFilter={setSelectedTagFilter}
              selectorFilters={updatedTags}
            />
          ) : (
            <DesktopFilterSelector
              selectedFilter={selectedTag}
              setSelectedFilter={setSelectedTagFilter}
              selectorFilters={updatedTags}
            />
          ))}
      </Box>
      {filteredTutorials.length <= 0 ? (
        <Box
          pt={8}
          pb={2}
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <SectionTitle title={t('overview.tutorial.noTutorialMessage')} />
        </Box>
      ) : (
        <Newsroom
          items={filteredTutorials.map((tutorial) => ({
            title: tutorial.title,
            date: {
              date: tutorial.publishedAt,
            },
            href: {
              label: 'shared.readTutorial',
              link: tutorial.path,
              translate: true,
            },
            img: {
              alt: tutorial.image?.alternativeText || '',
              src: tutorial.image?.url || '/images/news.png',
            },
          }))}
        />
      )}
    </Box>
  );
};

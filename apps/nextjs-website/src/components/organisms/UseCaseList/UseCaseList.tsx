'use client';

import { Tag } from '@/lib/types/tag';
import Newsroom from '@/editorialComponents/Newsroom/Newsroom';
import { Box, useMediaQuery } from '@mui/material';
import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import MobileFilterSelector from '@/components/molecules/MobileFilterSelector/MobileFilterSelector';
import DesktopFilterSelector from '@/components/molecules/DesktopFilterSelector/DesktopFilterSelector';
import SectionTitle from '@/components/molecules/SectionTitle/SectionTitle';
import { UseCase } from '../../../lib/types/useCaseData';

type UseCaseListProps = {
  readonly useCases: readonly UseCase[];
  readonly tags: readonly Tag[];
  readonly enableFilters?: boolean;
};

export const UseCaseList = ({
  tags,
  useCases,
  enableFilters,
}: UseCaseListProps) => {
  const t = useTranslations();
  const updatedTags = [
    {
      name: t('overview.useCases.all'),
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

  const filteredUseCases = useCases.filter((useCase) => {
    return (
      selectedTag === 0 ||
      useCase.tags?.some((tag) => tag.name === updatedTags[selectedTag].name)
    );
  });
  // eslint-disable-next-line functional/no-return-void
  const setSelectedTagFilter = (newTag: number): void => {
    if (newTag === selectedTag) return;
    addQueryParam('tag', `${newTag}`);
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
      <Box sx={{ paddingBottom: filteredUseCases.length > 0 ? '24px' : 0 }}>
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
      {filteredUseCases.length <= 0 ? (
        <Box
          pt={8}
          pb={2}
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <SectionTitle title={t('overview.useCases.noUseCaseMessage')} />
        </Box>
      ) : (
        <Newsroom
          items={useCases.map((useCase) => ({
            title: useCase.title,
            date: {
              date: useCase.publishedAt,
            },
            href: {
              label: 'shared.readUseCase',
              link: useCase.path,
              translate: true,
            },
            img: {
              alt: useCase.coverImage?.alternativeText || '',
              src: useCase.coverImage?.url || '/images/news.png',
            },
          }))}
        />
      )}
    </Box>
  );
};

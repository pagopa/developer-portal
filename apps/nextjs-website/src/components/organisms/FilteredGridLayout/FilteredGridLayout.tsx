'use client';

import { Tag } from '@/lib/types/tag';
import Newsroom, {
  INewsroomItem,
} from '@/editorialComponents/Newsroom/Newsroom';
import { Box, useMediaQuery } from '@mui/material';
import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import MobileFilterSelector from '@/components/molecules/MobileFilterSelector/MobileFilterSelector';
import DesktopFilterSelector from '@/components/molecules/DesktopFilterSelector/DesktopFilterSelector';
import SectionTitle from '@/components/molecules/SectionTitle/SectionTitle';
import { PRODUCT_HEADER_HEIGHT } from '@/components/atoms/ProductHeader/ProductHeader';

type FilteredGridLayoutProps = {
  readonly items: readonly (INewsroomItem & { tags: readonly Tag[] })[];
  readonly tags: readonly Tag[] | undefined;
  readonly enableFilters?: boolean;
  readonly noItemsMessageKey?: string;
};

export const FilteredGridLayout = ({
  tags = [],
  items,
  enableFilters,
  noItemsMessageKey = '',
}: FilteredGridLayoutProps) => {
  const t = useTranslations();
  const updatedTags = [
    {
      name: t('overview.all'),
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

  const filteredItems = items.filter((item) => {
    return (
      selectedTag === 0 ||
      item.tags?.some((tag) => tag.name === updatedTags[selectedTag].name)
    );
  });
  // eslint-disable-next-line functional/no-return-void
  const setSelectedTagFilter = (newTag: number): void => {
    if (newTag === selectedTag) return;
    addQueryParam('tag', `${newTag}`);
    const element = document.getElementById('filtered-grid');
    if (element) {
      const y =
        element.getBoundingClientRect().top +
        window.pageYOffset -
        PRODUCT_HEADER_HEIGHT;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
    setSelectedTag(newTag);
  };

  const addQueryParam = (key: string, value: string) => {
    const url = new URL(window.location.href);
    url.searchParams.set(key, value);
    window.history.pushState({}, '', url.toString());
  };
  const isSmallScreen = useMediaQuery('(max-width: 1000px)');
  return (
    <Box id='filtered-grid'>
      <Box sx={{ paddingBottom: filteredItems.length > 0 ? '24px' : 0 }}>
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
      {filteredItems.length <= 0 ? (
        <Box
          pt={8}
          pb={2}
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <SectionTitle title={t(noItemsMessageKey)} />
        </Box>
      ) : (
        <Newsroom
          items={filteredItems.map((item) => ({
            ...item,
          }))}
        />
      )}
    </Box>
  );
};

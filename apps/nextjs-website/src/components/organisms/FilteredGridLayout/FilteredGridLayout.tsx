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
import { PRODUCT_HEADER_HEIGHT } from '@/config';
import CardsGrid, {
  CardProps,
} from '@/components/molecules/CardsGrid/CardsGrid';

type FilteredGridLayoutProps = {
  readonly items?: readonly (INewsroomItem & { tags: readonly Tag[] })[];
  readonly cards?: readonly CardProps[];
  readonly tags?: readonly Tag[];
  readonly enableFilters?: boolean;
  readonly noItemsMessageKey?: string;
};

export const FilteredGridLayout = ({
  tags = [],
  items = [],
  cards = [],
  enableFilters = false,
  noItemsMessageKey = '',
}: FilteredGridLayoutProps) => {
  const t = useTranslations();
  const updatedTags = [
    {
      name: t('overview.all'),
      icon: {
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

  const filteredCards = cards.filter((card) => {
    if (selectedTag === 0) return true;
    const selectedTagName = updatedTags[selectedTag].name;
    return card.tags?.some((cardTag) => cardTag.name === selectedTagName);
  });

  const hasCards = cards.length > 0;
  const filteredCount = hasCards ? filteredCards.length : filteredItems.length;
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
      <Box sx={{ paddingBottom: filteredCount > 0 ? '24px' : 0 }}>
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
      {filteredCount === 0 ? (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            paddingBottom: '16px',
            paddingTop: '64px',
            width: '100%',
          }}
        >
          <SectionTitle title={t(noItemsMessageKey)} />
        </Box>
      ) : hasCards ? (
        <CardsGrid
          cards={filteredCards}
          cardSize={{ xs: 12, md: 4 }}
          containerSx={{
            pt: '22px',
            mt: '-22px',
          }}
          ctaButtonsVariant='outlined'
        />
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

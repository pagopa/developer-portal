'use client';
import { Media } from '@/lib/types/media';
import { Tutorial } from '@/lib/types/tutorialData';
import { Box, useTheme } from '@mui/material';
import React from 'react';
import SectionTitle from '@/components/molecules/SectionTitle/SectionTitle';
import CardsGrid from '@/components/molecules/CardsGrid/CardsGrid';
import { useTranslations } from 'next-intl';

type TutorialsOverviewProps = {
  title: string;
  tutorialCard: {
    title?: string;
    description?: string;
    icon: Media;
    tutorial: Tutorial;
  }[];
};

const TutorialsListOverview = ({
  title,
  tutorialCard,
}: TutorialsOverviewProps) => {
  const t = useTranslations();
  const theme = useTheme();
  return (
    <Box
      sx={{
        backgroundColor: theme.palette.grey[50],
      }}
    >
      <Box sx={{ paddingTop: '80px', paddingBottom: '48px' }}>
        <SectionTitle margin={0} title={title} subtitle={''} variant='h2' />
      </Box>
      <CardsGrid
        ctaButtonsVariant={'contained'}
        cardSize={{
          xs: 12,
          md: 12 / tutorialCard.length,
        }}
        containerSx={{
          pt: '22px',
          mt: '-22px',
        }}
        cards={tutorialCard.map((card) => ({
          title: card.tutorial.title || card.title || '',
          ctaLabel: t('overview.tutorialsList.ctaLabel'),
          text: card.description || '',
          icon: card.icon.url,
          useSrc: true,
          href: card.tutorial.path,
        }))}
      />
    </Box>
  );
};

export default TutorialsListOverview;

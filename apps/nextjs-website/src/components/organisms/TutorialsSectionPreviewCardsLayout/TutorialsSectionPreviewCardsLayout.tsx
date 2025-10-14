'use client';
import { Tutorial } from '@/lib/types/tutorialData';
import { Box, useTheme } from '@mui/material';
import React from 'react';
import SectionTitle from '@/components/molecules/SectionTitle/SectionTitle';
import CardsGrid from '@/components/molecules/CardsGrid/CardsGrid';
import { useTranslations } from 'next-intl';

type TutorialsSectionPreviewCardsLayoutProps = {
  title: string;
  tutorials: readonly Tutorial[];
};

const TutorialsSectionPreviewCardsLayout = ({
  title,
  tutorials,
}: TutorialsSectionPreviewCardsLayoutProps) => {
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
          md: 12 / tutorials.length,
        }}
        containerSx={{
          pt: '22px',
          mt: '-22px',
        }}
        cards={tutorials.map((tutorial) => ({
          title: tutorial.title || '',
          ctaLabel: t('overview.tutorialsList.ctaLabel'),
          text: tutorial.description || '',
          icon: tutorial.icon?.url || '',
          useSrc: tutorial.icon !== undefined,
          href: tutorial.path,
        }))}
      />
    </Box>
  );
};

export default TutorialsSectionPreviewCardsLayout;

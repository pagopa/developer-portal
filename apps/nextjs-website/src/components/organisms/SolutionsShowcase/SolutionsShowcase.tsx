import React from 'react';
import SectionTitle from '@/components/molecules/SectionTitle/SectionTitle';
import { Box } from '@mui/material';
import CardsGrid from '@/components/molecules/CardsGrid/CardsGrid';

type SolutionsShowcaseProps = {
  title?: string;
  cards: {
    title: string;
    text: string;
    href: string;
    logoUrl: string;
    tags?: { readonly label: string; readonly path?: string }[];
  }[];
  py?: number;
};

const SolutionsShowcase = ({
  title,
  cards,
  py = 5,
}: SolutionsShowcaseProps) => {
  return (
    <Box py={py}>
      {title && <SectionTitle title={title} />}
      <CardsGrid
        cardVariant={'contained'}
        cardSvg={true}
        cards={cards.map((card) => ({
          title: card.title,
          text: card.text,
          href: card.href,
          icon: card.logoUrl,
          tags: card.tags,
        }))}
      />
    </Box>
  );
};

export default SolutionsShowcase;

'use client';
import React from 'react';
import SectionTitle from '@/components/molecules/SectionTitle/SectionTitle';
import { Box, useTheme } from '@mui/material';
import CardsGrid from '@/components/molecules/CardsGrid/CardsGrid';

type ProductsShowcaseProps = {
  title: string;
  cards: {
    title: string;
    text: string;
    href: string;
    logoUrl: string;
  }[];
};

const ProductsShowcase = ({ title, cards }: ProductsShowcaseProps) => {
  const theme = useTheme();
  return (
    <Box py={5} sx={{ backgroundColor: theme.palette.grey[50] }}>
      <SectionTitle title={title} />
      <CardsGrid
        cardVariant={'outlined'}
        cardSvg={true}
        cards={cards.map((card) => ({
          title: card.title,
          text: card.text,
          href: card.href,
          icon: card.logoUrl,
        }))}
      />
    </Box>
  );
};

export default ProductsShowcase;

'use client';
import React from 'react';
import SectionTitle from '@/components/molecules/SectionTitle/SectionTitle';
import { Box, GridSize, useTheme } from '@mui/material';
import CardsGrid from '@/components/molecules/CardsGrid/CardsGrid';

type ProductsShowcaseProps = {
  title: string;
  verticalPadding?: number;
  backgroundColor?: string;
  cards: {
    title: string;
    text: string;
    href: string;
    logoUrl: string;
  }[];
  cardSize?: {
    xs: boolean | GridSize;
    md: boolean | GridSize;
  };
};

const ProductsShowcase = ({
  title,
  verticalPadding = 5,
  backgroundColor,
  cards,
  cardSize,
}: ProductsShowcaseProps) => {
  const theme = useTheme();
  return (
    <Box
      sx={{
        backgroundColor: backgroundColor || theme.palette.grey[50],
        marginY: verticalPadding,
      }}
    >
      <SectionTitle margin={'0 0 1.75rem 0'} title={title} />
      <CardsGrid
        cardSize={cardSize}
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

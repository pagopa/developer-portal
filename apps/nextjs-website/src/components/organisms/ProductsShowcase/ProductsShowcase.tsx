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
    svgPath: string;
  }[];
};

const ProductsShowcase = ({ title, cards }: ProductsShowcaseProps) => {
  const theme = useTheme();
  return (
    <Box py={5} sx={{ backgroundColor: theme.palette.background.default }}>
      <SectionTitle title={title} />
      <CardsGrid
        cardVariant={'contained'}
        cardSvg={true}
        cards={cards.map((card) => ({
          title: card.title,
          text: card.text,
          href: card.href,
          icon: card.svgPath,
        }))}
      />
    </Box>
  );
};

export default ProductsShowcase;

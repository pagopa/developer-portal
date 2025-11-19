import React from 'react';
import SectionTitle from '@/components/molecules/SectionTitle/SectionTitle';
import { Box } from '@mui/material';
import CardsGrid, {
  CardProps,
} from '@/components/molecules/CardsGrid/CardsGrid';

type SolutionsShowcaseProps = {
  title?: string;
  cards: readonly Pick<
    CardProps,
    'title' | 'text' | 'href' | 'icon' | 'labels'
  >[];
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
        ctaButtonsVariant={'contained'}
        cards={cards.map((card) => ({
          ...card,
          useSrc: true,
        }))}
        containerSx={{
          pt: '22px',
          mt: '-22px',
        }}
      />
    </Box>
  );
};

export default SolutionsShowcase;

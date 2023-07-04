import React from 'react';
import { Box, Grid } from '@mui/material';
import EContainer from '@pagopa/pagopa-editorial-components/dist/components/EContainer';
import CtaCard from '@/components/atoms/CtaCard/CtaCard';
import { translations } from '@/_contents/translations';
import IconWrapper from '@/components/atoms/IconWrapper/IconWrapper';

type CardsGridProps = {
  cardVariant?: 'text' | 'contained' | 'outlined';
  cardSvg?: boolean;
  cardSize?: boolean;
  cards: {
    title: string;
    text: string;
    href: string;
    icon: string;
  }[];
};

const CardsGrid = ({ cards, cardVariant, cardSvg }: CardsGridProps) => {
  const { shared } = translations;

  return (
    <EContainer>
      <Box pb={4}>
        <Grid container spacing={2}>
          {cards.map(({ title, text, href, icon }, index) => {
            return (
              <Grid key={index} item xs={12} md={6}>
                <CtaCard
                  minHeight={150}
                  title={title}
                  text={text}
                  cta={{
                    label: shared.moreInfo,
                    href,
                    variant: cardVariant,
                  }}
                  icon={<IconWrapper icon={icon} isSvg={cardSvg} />}
                />
              </Grid>
            );
          })}
        </Grid>
      </Box>
    </EContainer>
  );
};

export default CardsGrid;

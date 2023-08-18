'use client';
import React from 'react';
import { Box, Grid, GridSize } from '@mui/material';
import EContainer from '@pagopa/pagopa-editorial-components/dist/components/EContainer';
import CtaCard from '@/components/atoms/CtaCard/CtaCard';
import { translations } from '@/_contents/translations';
import IconWrapper from '@/components/atoms/IconWrapper/IconWrapper';

type CardsGridProps = {
  cardVariant?: 'text' | 'contained' | 'outlined';
  cardSvg?: boolean;
  cardSize?: {
    xs: boolean | GridSize;
    md: boolean | GridSize;
  };
  cards: {
    coomingSoon?: boolean;
    title: string;
    text: string;
    href?: string;
    icon: string;
  }[];
};

const CardsGrid = ({
  cards,
  cardVariant,
  cardSvg,
  cardSize,
}: CardsGridProps) => {
  const { shared } = translations;

  return (
    <EContainer>
      <Box pb={4}>
        <Grid container spacing={2}>
          {cards.map(({ title, text, href, icon, coomingSoon }, index) => {
            return (
              <Grid
                key={index}
                item
                xs={cardSize?.xs || 12}
                md={cardSize?.md || 6}
              >
                <CtaCard
                  coomingSoon={coomingSoon}
                  title={title}
                  text={text}
                  cta={{
                    label: coomingSoon ? shared.coomingSoon : shared.moreInfo,
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

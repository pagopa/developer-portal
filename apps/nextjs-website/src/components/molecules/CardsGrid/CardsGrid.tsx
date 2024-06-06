'use client';
import React from 'react';
import { Box, Grid, GridSize, useTheme } from '@mui/material';
import EContainer from '@/editorialComponents/EContainer/EContainer';
import CtaCard from '@/components/atoms/CtaCard/CtaCard';
import IconWrapper from '@/components/atoms/IconWrapper/IconWrapper';
import { useTranslations } from 'next-intl';

type CardsGridProps = {
  cardVariant?: 'text' | 'contained' | 'outlined';
  cardSvg?: boolean;
  cardSize?: {
    xs: boolean | GridSize;
    md: boolean | GridSize;
  };
  cards: {
    comingSoon?: boolean;
    title: string;
    text: string;
    href?: string;
    icon: string;
    iconColor?: string;
    tags?: { readonly label: string; readonly path?: string }[];
  }[];
};

const CardsGrid = ({
  cards,
  cardVariant,
  cardSvg,
  cardSize,
}: CardsGridProps) => {
  const { palette } = useTheme();
  const t = useTranslations('shared');

  return (
    <EContainer>
      <Box pb={4} width={'100%'}>
        <Grid container spacing={3}>
          {cards.map(
            (
              { title, text, href, icon, comingSoon, iconColor, tags },
              index
            ) => {
              return (
                <Grid
                  key={index}
                  item
                  xs={cardSize?.xs || 12}
                  md={cardSize?.md || 6}
                >
                  <CtaCard
                    comingSoon={comingSoon}
                    title={title}
                    text={text}
                    cta={{
                      label: t(comingSoon ? 'comingSoon' : 'moreInfo'),
                      href,
                      variant: cardVariant,
                    }}
                    icon={
                      <IconWrapper
                        color={iconColor || palette.text.primary}
                        icon={icon}
                        isSvg={cardSvg}
                      />
                    }
                    tags={tags}
                  />
                </Grid>
              );
            }
          )}
        </Grid>
      </Box>
    </EContainer>
  );
};

export default CardsGrid;

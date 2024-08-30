'use client';
import React from 'react';
import { Box, Grid, GridSize, SxProps, useTheme } from '@mui/material';
import EContainer from '@/editorialComponents/EContainer/EContainer';
import CtaCard from '@/components/atoms/CtaCard/CtaCard';
import IconWrapper from '@/components/atoms/IconWrapper/IconWrapper';
import { useTranslations } from 'next-intl';

export type CardsGridProps = {
  cardSize?: {
    xs: boolean | GridSize;
    md: boolean | GridSize;
  };
  containerSx?: SxProps;
  ctaButtonsVariant?: 'text' | 'contained' | 'outlined';
  cards: {
    target?: '_blank' | '_self' | '_parent' | '_top';
    comingSoon?: boolean;
    title: string;
    text: string;
    href?: string;
    ctaLabel?: string;
    icon: string;
    iconColor?: string;
    tags?: { readonly label: string; readonly path?: string }[];
    isSvg?: boolean;
  }[];
};

const CardsGrid = ({
  cards,
  cardSize,
  containerSx,
  ctaButtonsVariant,
}: CardsGridProps) => {
  const { palette } = useTheme();
  const t = useTranslations('shared');

  return (
    <EContainer containerSx={containerSx}>
      <Box pb={4} width={'100%'}>
        <Grid container spacing={3}>
          {cards.map(
            (
              {
                target,
                title,
                text,
                href,
                icon,
                comingSoon,
                iconColor,
                tags,
                ctaLabel,
                isSvg,
              },
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
                      target: target || '_self',
                      label: ctaLabel
                        ? ctaLabel
                        : t(comingSoon ? 'comingSoon' : 'moreInfo'),
                      href,
                      variant: ctaButtonsVariant,
                    }}
                    icon={
                      <IconWrapper
                        color={iconColor || palette.text.primary}
                        icon={icon}
                        isSvg={isSvg}
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

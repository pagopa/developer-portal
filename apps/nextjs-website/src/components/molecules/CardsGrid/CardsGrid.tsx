'use client';
import React from 'react';
import { Box, Grid, GridSize, SxProps, useTheme } from '@mui/material';
import EContainer from '@/editorialComponents/EContainer/EContainer';
import CtaCard from '@/components/atoms/CtaCard/CtaCard';
import IconWrapper from '@/components/atoms/IconWrapper/IconWrapper';
import { useTranslations } from 'next-intl';
import { Tag } from '@/lib/types/tag';

export type CardProps = {
  target?: '_blank' | '_self' | '_parent' | '_top';
  comingSoon?: boolean;
  title: string;
  text: string;
  href?: string;
  ctaLabel?: string;
  icon?: string;
  iconColor?: string;
  labels?: { readonly label: string; readonly path?: string }[];
  useSrc: boolean;
  tags?: readonly Tag[];
};

export type CardsGridProps = {
  readonly cardSize?: {
    xs: boolean | GridSize;
    md: boolean | GridSize;
  };
  readonly containerSx?: SxProps;
  readonly ctaButtonsVariant?: 'text' | 'contained' | 'outlined';
  readonly cards: readonly CardProps[];
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
                labels,
                ctaLabel,
                useSrc,
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
                      icon && (
                        <IconWrapper
                          color={iconColor || palette.text.primary}
                          icon={icon}
                          useSrc={useSrc}
                        />
                      )
                    }
                    labels={labels}
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

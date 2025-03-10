'use client';
import React from 'react';
import SectionTitle from '@/components/molecules/SectionTitle/SectionTitle';
import { Box, Stack, Typography, useTheme } from '@mui/material';
import LinkButton from '@/components/atoms/LinkButton/LinkButton';
import CardsGrid from '@/components/molecules/CardsGrid/CardsGrid';
import IconWrapper from '@/components/atoms/IconWrapper/IconWrapper';
import { useTranslations } from 'next-intl';

type StartInfoProps = {
  title?: string;
  cardVariant?: 'text' | 'contained' | 'outlined';
  cards: {
    comingSoon?: boolean;
    title: string;
    text: string;
    href?: string;
    iconName: string;
    iconColor?: string;
    useSrc: boolean;
  }[];
  cta?: {
    text: string;
    label: string;
    href: string;
    iconName?: string;
  };
};

const StartInfo = ({
  title,
  cards,
  cta,
  cardVariant = 'contained',
}: StartInfoProps) => {
  const { palette } = useTheme();
  const t = useTranslations();

  return (
    <>
      <Box pt={10} pb={6} sx={{ backgroundColor: palette.grey[50] }}>
        <Box mb={2}>
          <SectionTitle
            title={title || t('overview.startInfo.title')}
            variant='h2'
          />
        </Box>
        <CardsGrid
          ctaButtonsVariant={cardVariant}
          cardSize={{
            xs: 12,
            md: 12 / cards.length,
          }}
          cards={cards.map((card) => ({
            comingSoon: card.comingSoon,
            title: card.title,
            text: card.text,
            href: card.href,
            icon: card.iconName,
            iconColor: card.iconColor,
            useSrc: card.useSrc,
          }))}
          containerSx={{
            pt: '22px',
            mt: '-22px',
          }}
        />
      </Box>
      {cta && (
        <Box py={2} sx={{ backgroundColor: palette.grey[50] }}>
          <Stack
            spacing={2}
            direction={{ md: 'row', xs: 'column' }}
            justifyContent='center'
            alignItems='center'
            paddingY={0.5}
          >
            <Box pt={0.5}>
              <IconWrapper
                color={palette.text.primary}
                size={26}
                icon={cta.iconName || 'MenuBook'}
                useSrc={false}
              />
            </Box>
            <Typography variant='body1' mb={2}>
              {cta.text}
            </Typography>
            <LinkButton href={cta.href} label={cta.label} />
          </Stack>
        </Box>
      )}
    </>
  );
};

export default StartInfo;

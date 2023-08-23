'use client';
import React from 'react';
import SectionTitle from '@/components/molecules/SectionTitle/SectionTitle';
import { Box, Stack, Typography, useTheme } from '@mui/material';
import LinkButton from '@/components/atoms/LinkButton/LinkButton';
import CardsGrid from '@/components/molecules/CardsGrid/CardsGrid';
import IconWrapper from '@/components/atoms/IconWrapper/IconWrapper';

type StartInfoProps = {
  title: string;
  cards: {
    coomingSoon?: boolean;
    title: string;
    text: string;
    href?: string;
    iconName: string;
  }[];
  cta?: {
    text: string;
    label: string;
    href: string;
    iconName?: string;
  };
};

const StartInfo = ({ title, cards, cta }: StartInfoProps) => {
  const { palette } = useTheme();
  return (
    <>
      <Box py={11} sx={{ backgroundColor: palette.background.default }}>
        <SectionTitle title={title} />
        <CardsGrid
          cardSize={{
            xs: 12,
            md: 12 / cards.length,
          }}
          cards={cards.map((card) => ({
            coomingSoon: card.coomingSoon,
            title: card.title,
            text: card.text,
            href: card.href,
            icon: card.iconName,
          }))}
        />
      </Box>
      {cta && (
        <Box py={4} sx={{ backgroundColor: palette.background.default }}>
          <Stack
            spacing={2}
            direction={{ md: 'row', xs: 'column' }}
            justifyContent='center'
            alignItems='center'
          >
            <Box pt={0.5}>
              <IconWrapper
                color={palette.text.primary}
                size={26}
                icon={cta.iconName || 'MenuBook'}
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

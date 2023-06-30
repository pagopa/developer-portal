import React from 'react';
import SectionTitle from '@/components/molecules/SectionTitle/SectionTitle';
import { Box, Stack, Typography, useTheme } from '@mui/material';
import { MenuBook } from '@mui/icons-material';
import LinkButton from '@/components/atoms/LinkButton/LinkButton';
import StartCards from '@/components/molecules/StartCards/StartCards';

type StartInfoProps = {
  title: string;
  cards: {
    title: string;
    text: string;
    href: string;
    iconName: string;
  }[];
  cta?: {
    text: string;
    label: string;
    href: string;
  };
};

const StartInfo = ({ title, cards, cta }: StartInfoProps) => {
  const theme = useTheme();
  return (
    <>
      <Box py={11} sx={{ backgroundColor: theme.palette.background.default }}>
        <SectionTitle title={title} />
        <StartCards
          cards={cards.map((card) => ({
            title: card.title,
            text: card.text,
            href: card.href,
            iconName: card.iconName,
          }))}
        ></StartCards>
      </Box>
      {cta && (
        <Box py={4} sx={{ backgroundColor: theme.palette.background.default }}>
          <Stack
            spacing={2}
            direction={{ md: 'row', xs: 'column' }}
            justifyContent='center'
            alignItems='center'
          >
            <MenuBook />
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

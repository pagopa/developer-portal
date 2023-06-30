import React from 'react';
import SectionTitle from '@/components/molecules/SectionTitle/SectionTitle';
import { Box, Grid, Stack, Typography, useTheme } from '@mui/material';
import EContainer from '@pagopa/pagopa-editorial-components/dist/components/EContainer';
import CtaCard, { CtaCardProps } from '@/components/atoms/CtaCard/CtaCard';
import { MenuBook } from '@mui/icons-material';
import LinkButton from '@/components/atoms/LinkButton/LinkButton';

type StartInfoProps = {
  title: string;
  cards: CtaCardProps[];
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
        <EContainer>
          <Box pb={4}>
            <Grid container spacing={2}>
              {cards.map((props, index) => (
                <Grid key={index} item xs={12} md>
                  <CtaCard {...props} />
                </Grid>
              ))}
            </Grid>
          </Box>
        </EContainer>
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

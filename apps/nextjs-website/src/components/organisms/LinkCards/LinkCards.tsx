import React from 'react';
import { Box, Grid, Typography, useTheme } from '@mui/material';
import EContainer from '@pagopa/pagopa-editorial-components/dist/components/EContainer';
import { translations } from '@/_contents/translations';
import LinkCard from '@/components/molecules/LinkCard/LinkCard';
import SectionTitle from '@/components/molecules/SectionTitle/SectionTitle';

type LinkCardsProps = {
  title: string;
  subtitle: string;
  cta: {
    label: string;
    href: string;
  };
  cardsTitle: string;
  cards: {
    title: string;
    text: string;
    href: string;
  }[];
};

const LinkCards = ({
  title,
  subtitle,
  cta,
  cardsTitle,
  cards,
}: LinkCardsProps) => {
  const theme = useTheme();
  const { shared } = translations;

  return (
    <Box py={11} sx={{ backgroundColor: theme.palette.background.default }}>
      <SectionTitle title={title} subtitle={subtitle} cta={cta}>
        <Typography
          content='div'
          mb={3}
          mt={6}
          color={theme.palette.grey[500]}
          fontSize={14}
          sx={{
            fontWeight: theme.typography.fontWeightBold,
            textTransform: 'uppercase',
          }}
        >
          {cardsTitle}
        </Typography>
      </SectionTitle>
      <EContainer>
        <Box pb={4}>
          <Grid container spacing={2}>
            {cards.map(({ title, text, href }, index) => {
              return (
                <Grid key={index} item xs={12} md={6} lg>
                  <LinkCard
                    minHeight={155}
                    title={title}
                    text={text}
                    link={{
                      href,
                      label: shared.goToModel,
                    }}
                  />
                </Grid>
              );
            })}
          </Grid>
        </Box>
      </EContainer>
    </Box>
  );
};

export default LinkCards;

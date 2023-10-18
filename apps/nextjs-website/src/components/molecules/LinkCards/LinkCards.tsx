'use client';
import React from 'react';
import { Box, Grid } from '@mui/material';
import LinkCard from '@/components/molecules/LinkCard/LinkCard';

type LinkCardsProps = {
  cards: {
    title: string;
    text: string;
    href: string;
    label: string;
  }[];
};

const LinkCards = ({ cards }: LinkCardsProps) => {
  return (
    <Box pt={3} pb={4}>
      <Grid container spacing={4}>
        {cards.map(({ title, text, href, label }, index) => {
          return (
            <Grid key={index} item xs={12} md={6} lg>
              <LinkCard
                minHeight={155}
                title={title}
                text={text}
                link={{
                  href,
                  label,
                }}
              />
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default LinkCards;

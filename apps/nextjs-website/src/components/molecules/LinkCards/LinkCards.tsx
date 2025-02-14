'use client';
import React from 'react';
import { Box, Grid } from '@mui/material';
import LinkCard from '@/components/molecules/LinkCard/LinkCard';

type LinkCardsProps = {
  cards: {
    title: string;
    description: string;
    href: string;
    label: string;
  }[];
};

const LinkCards = ({ cards }: LinkCardsProps) => {
  return (
    <Box pt={3} pb={4}>
      <Grid container spacing={4}>
        {cards.map(({ title, description, href, label }, index) => {
          return (
            <Grid key={index} item xs={12} md={6} lg>
              <LinkCard
                minHeight={155}
                title={title}
                description={description}
                link={{
                  href,
                  label,
                }}
                variant='h3'
              />
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default LinkCards;

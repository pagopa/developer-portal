import React from 'react';
import { Newsroom } from '@pagopa/pagopa-editorial-components';
import SectionTitle from '@/components/molecules/SectionTitle/SectionTitle';
import { Box } from '@mui/material';

type NewsProps = {
  title: string;
  subtitle?: string;
  cta?: {
    label: string;
    href: string;
  };
  marginTop?: number;
  cards: {
    title: string;
    dateString: string;
    image?: {
      url: string;
      alt: string;
    };
    href: {
      label: string;
      link: string;
      title: string;
    };
  }[];
};

const News = ({ title, subtitle, cta, marginTop, cards }: NewsProps) => {
  return (
    <Box marginTop={marginTop}>
      <SectionTitle title={title} subtitle={subtitle} cta={cta} />
      <Newsroom
        items={cards.map((card) => ({
          title: card.title,
          date: {
            date: new Date(card.dateString),
          },
          href: card.href,
          img: {
            alt: card.image?.alt || '',
            src: card.image?.url || '/images/news.png',
          },
        }))}
      />
    </Box>
  );
};

export default News;

'use client';
import React from 'react';
import SectionTitle from '@/components/molecules/SectionTitle/SectionTitle';
import { Box } from '@mui/material';
import Newsroom from '@/editorialComponents/Newsroom/Newsroom';
import { translations } from '@/_contents/translations';

type NewsProps = {
  title: string;
  subtitle?: string;
  cta?: {
    label: string;
    href: string;
  };
  marginTop?: number;
  cards: {
    coomingSoon?: boolean;
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
  const { shared } = translations;
  return (
    <Box marginTop={marginTop}>
      <SectionTitle title={title} subtitle={subtitle} cta={cta} />
      <Box mt={2}>
        <Newsroom
          items={cards.map((card) => ({
            coomingSoonLabel: !card.coomingSoon
              ? undefined
              : shared.coomingSoon,
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
    </Box>
  );
};

export default News;

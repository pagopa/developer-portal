import React from 'react';
import { Newsroom } from '@pagopa/pagopa-editorial-components';
import SectionTitle from '@/components/molecules/SectionTitle/SectionTitle';
import { Box } from '@mui/material';

type NewsProps = {
  title: string;
  subtitle?: string;
  ctaLabel?: string;
  marginTop?: number;
  href?: string;
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

const News = ({
  title,
  subtitle,
  ctaLabel,
  href,
  cards,
  marginTop,
}: NewsProps) => {
  return (
    <Box marginTop={marginTop}>
      <SectionTitle
        title={title}
        subtitle={subtitle}
        ctaLabel={ctaLabel}
        href={href}
      />
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

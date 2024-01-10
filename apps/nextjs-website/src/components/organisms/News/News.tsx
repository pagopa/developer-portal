'use client';
import React from 'react';
import SectionTitle from '@/components/molecules/SectionTitle/SectionTitle';
import { Box } from '@mui/material';
import Newsroom from '@/editorialComponents/Newsroom/Newsroom';
import { useTranslations } from 'next-intl';

type NewsProps = {
  title: string;
  subtitle?: string;
  cta?: {
    label: string;
    href: string;
  };
  marginTop?: number;
  cards: {
    comingSoon?: boolean;
    title: string;
    dateString?: string;
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
  const t = useTranslations('shared');
  const coomingSoonLabel = t('comingSoon');
  return (
    <Box marginTop={marginTop}>
      <SectionTitle title={title} subtitle={subtitle} cta={cta} />
      <Box mt={2}>
        <Newsroom
          items={cards.map((card) => ({
            comingSoonLabel: !card.comingSoon ? undefined : coomingSoonLabel,
            title: card.title,
            date: {
              date: card.dateString ? new Date(card.dateString) : undefined,
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

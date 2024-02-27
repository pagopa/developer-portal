'use client';
import React from 'react';
import SectionTitle from '@/components/molecules/SectionTitle/SectionTitle';
import { Box } from '@mui/material';
import Newsroom from '@/editorialComponents/Newsroom/Newsroom';
import { useTranslations } from 'next-intl';

type NewsShowcaseProps = {
  title: string;
  subtitle?: string;
  cta?: {
    label: string;
    href: string;
  };
  marginTop?: number;
  items: {
    comingSoon?: boolean;
    title: string;
    publishedAt?: string;
    image: {
      url: string;
      alternativeText: string | null;
    } | null;
    link: {
      url: string;
      text: string;
    };
  }[];
};

const NewsShowcase = ({
  title,
  subtitle,
  cta,
  marginTop,
  items,
}: NewsShowcaseProps) => {
  const t = useTranslations('shared');
  const coomingSoonLabel = t('comingSoon');
  return (
    <Box marginTop={marginTop}>
      <SectionTitle title={title} subtitle={subtitle} cta={cta} />
      <Box mt={2}>
        <Newsroom
          items={items.map((item) => ({
            comingSoonLabel: !item.comingSoon ? undefined : coomingSoonLabel,
            title: item.title,
            date: {
              date:
                (item.publishedAt &&
                  item.publishedAt !== '' &&
                  new Date(item.publishedAt)) ||
                undefined,
            },
            href: { link: item.link.url, label: item.link.text },
            img: {
              alt: (item.image && item.image.alternativeText) || '',
              src: (item.image && item.image.url) || '/images/news.png',
            },
          }))}
        />
      </Box>
    </Box>
  );
};

export default NewsShowcase;

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
  newsMarginTop?: number;
  items: {
    comingSoon?: boolean;
    title: string;
    publishedAt?: Date;
    image?: {
      url: string;
      alternativeText?: string | null;
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
  newsMarginTop = 2,
}: NewsShowcaseProps) => {
  const t = useTranslations('shared');
  const coomingSoonLabel = t('comingSoon');
  return (
    <Box marginTop={marginTop}>
      <SectionTitle title={title} subtitle={subtitle} cta={cta} />
      <Box mt={newsMarginTop}>
        <Newsroom
          items={items.map((item) => ({
            comingSoonLabel: !item.comingSoon ? undefined : coomingSoonLabel,
            title: item.title,
            date: {
              date: item.publishedAt,
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

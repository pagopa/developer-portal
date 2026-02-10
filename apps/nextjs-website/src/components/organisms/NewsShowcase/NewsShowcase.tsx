'use client';
import React, { useMemo } from 'react';
import SectionTitle from '@/components/molecules/SectionTitle/SectionTitle';
import { Box, useTheme } from '@mui/material';
import Newsroom from '@/editorialComponents/Newsroom/Newsroom';
import { useTranslations } from 'next-intl';

export type NewsShowcaseItemProps = {
  readonly comingSoon?: boolean;
  readonly title: string;
  readonly publishedAt?: Date;
  readonly label?: string;
  readonly link: {
    readonly text: string;
    readonly url: string;
    readonly target?: '_self' | '_blank' | '_parent' | '_top';
  };
  readonly image?: {
    readonly url: string;
    readonly alternativeText?: string;
  };
};

export type NewsShowcaseProps = {
  readonly title: string;
  readonly subtitle?: string;
  readonly link?: {
    readonly text: string;
    readonly url: string;
    readonly target?: '_self' | '_blank' | '_parent' | '_top';
  };
  readonly marginTop?: number;
  readonly newsMarginTop?: number;
  readonly items: readonly NewsShowcaseItemProps[];
  readonly paddingTop?: number;
  readonly backgroundVariant?: 'white' | 'lightGrey';
};

const NewsShowcase = ({
  title,
  subtitle,
  link,
  marginTop,
  items,
  newsMarginTop = 2,
  backgroundVariant = 'white',
  paddingTop,
}: NewsShowcaseProps) => {
  const theme = useTheme();
  const t = useTranslations();

  const backgroundColor = useMemo(
    () => ({
      white: theme.palette.background.paper,
      lightGrey: theme.palette.grey[50],
    }),
    [theme]
  );

  const sectionMargin = useMemo(
    () => ({
      white: 0,
      lightGrey: '4rem 0 0',
    }),
    []
  );

  return (
    <Box
      sx={{
        marginTop: marginTop,
        paddingTop: paddingTop,
        backgroundColor: backgroundColor[backgroundVariant],
      }}
    >
      <SectionTitle
        margin={sectionMargin[backgroundVariant]}
        title={title}
        subtitle={subtitle}
        link={link}
        variant='h2'
      />
      <Box mt={newsMarginTop}>
        <Newsroom
          items={items.map((item) => ({
            comingSoonLabel: item.comingSoon
              ? t('shared.comingSoon')
              : undefined,
            title: item.title,
            date: {
              date: item.publishedAt,
            },
            label: item.label,
            href: { link: item.link.url, label: item.link.text },
            img: item.image
              ? {
                  alt: (item.image && item.image.alternativeText) || '',
                  src: (item.image && item.image.url) || '/images/news.png',
                }
              : undefined,
          }))}
        />
      </Box>
    </Box>
  );
};

export default NewsShowcase;

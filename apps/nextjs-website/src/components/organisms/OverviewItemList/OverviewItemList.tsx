'use client';

import React from 'react';
import { Path } from '@/lib/types/path';
import NewsShowcase, {
  NewsShowcaseItemProps,
} from '@/components/organisms/NewsShowcase/NewsShowcase';
import { useTranslations } from 'next-intl';

type OverviewItemListProps = {
  title?: string;
  titleKey?: string;
  subtitle: string;
  ctaLabelKey: string;
  itemPath: Path;
  items: NewsShowcaseItemProps[];
  backgroundVariant?: 'white' | 'lightGrey';
};

const OverviewItemList = ({
  title,
  titleKey,
  subtitle,
  ctaLabelKey,
  items,
  itemPath,
  backgroundVariant,
}: OverviewItemListProps) => {
  const t = useTranslations();

  return (
    <NewsShowcase
      marginTop={8}
      title={title || t(titleKey)}
      subtitle={subtitle}
      link={{
        text: t(ctaLabelKey) || '',
        url: itemPath.path,
      }}
      items={items.map((item) => ({
        ...item,
        link: {
          url: item.link.url,
          text: t(item.link.text),
        },
      }))}
      backgroundVariant={backgroundVariant}
    />
  );
};

export default OverviewItemList;

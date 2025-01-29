'use client';
import React from 'react';
import Listing from '@/editorialComponents/Listing/Listing';
import { useTranslations } from 'next-intl';

export type RelatedLinksProps = {
  title?: string;
  links: {
    text: string;
    href: string;
    target?: '_self' | '_blank' | '_parent' | '_top';
  }[];
  backgroundVariant?: 'white' | 'lightGrey';
};

const RelatedLinks = ({
  title,
  links,
  backgroundVariant,
}: RelatedLinksProps) => {
  const t = useTranslations('shared');
  return (
    <Listing
      items={links}
      name={title ?? t('relatedLinks')}
      backgroundVariant={backgroundVariant}
    />
  );
};

export default RelatedLinks;

'use client';
import React from 'react';
import Listing from '@/editorialComponents/Listing/Listing';
import { useTranslations } from 'next-intl';

type RelatedLinksProps = {
  title?: string;
  links: {
    text: string;
    href: string;
    target?: '_self' | '_blank' | '_parent' | '_top';
  }[];
};

const RelatedLinks = ({ title, links }: RelatedLinksProps) => {
  const t = useTranslations('shared');
  return <Listing items={links} name={title ?? t('relatedLinks')} />;
};

export default RelatedLinks;

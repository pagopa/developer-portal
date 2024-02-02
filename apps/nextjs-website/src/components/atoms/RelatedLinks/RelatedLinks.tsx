'use client';
import React from 'react';
import Listing from '@/editorialComponents/Listing/Listing';

type RelatedLinksProps = {
  title: string;
  links: {
    text: string;
    href: string;
    target?: '_self' | '_blank' | '_parent' | '_top';
  }[];
};

const RelatedLinks = ({ title, links }: RelatedLinksProps) => {
  return <Listing items={links} name={title} />;
};

export default RelatedLinks;

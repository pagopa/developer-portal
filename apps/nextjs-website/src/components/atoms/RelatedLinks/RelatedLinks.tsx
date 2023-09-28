'use client';
import React from 'react';
import { Box } from '@mui/material';
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
  return (
    <Box pb={4}>
      <Listing items={links} name={title} />
    </Box>
  );
};

export default RelatedLinks;

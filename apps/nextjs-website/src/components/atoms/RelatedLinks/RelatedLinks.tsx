import React from 'react';
import { Listing } from '@pagopa/pagopa-editorial-components';
import { Box } from '@mui/material';

type RelatedLinksProps = {
  title: string;
  links: {
    text: string;
    href: string;
  }[];
};

const RelatedLinks = ({ title, links }: RelatedLinksProps) => {
  return (
    <Box pb={4}>
      <Listing
        date={{
          date: new Date('2023-06-29T22:35:42.883Z'),
          locale: 'it-IT',
          options: {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
          },
          preDate: '',
        }}
        items={links}
        name={title}
        title=''
      />
    </Box>
  );
};

export default RelatedLinks;

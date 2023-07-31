import { ReactNode } from 'react';
import MUILink from '@mui/material/Link';
import NextLink from 'next/link';
import { PageLinkProps } from 'gitbook-docs/markdoc/schema/pageLink';

export const PageLink = ({ url, children }: PageLinkProps<ReactNode>) => (
  <MUILink component={NextLink} href={url} sx={{ textDecoration: 'none' }}>
    {children}
  </MUILink>
);

export default PageLink;

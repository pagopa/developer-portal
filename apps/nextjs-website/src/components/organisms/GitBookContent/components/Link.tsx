import { ReactNode } from 'react';
import MUILink from '@mui/material/Link';
import NextLink from 'next/link';
import { LinkProps } from 'gitbook-docs/markdoc/schema/link';

export const Link = ({ title, href, children }: LinkProps<ReactNode>) => (
  <MUILink
    component={NextLink}
    href={href}
    title={title}
    sx={{ textDecoration: 'none' }}
  >
    {children}
  </MUILink>
);



export default Link;

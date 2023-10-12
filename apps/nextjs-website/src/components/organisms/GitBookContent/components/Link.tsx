import { ReactNode } from 'react';
import MUILink from '@mui/material/Link';
import NextLink from 'next/link';
import { LinkProps } from 'gitbook-docs/markdoc/schema/link';
import { urlRewrite } from '@/helpers/url.helper';

export const Link = ({ title, href, children }: LinkProps<ReactNode>) => (
  <MUILink
    component={NextLink}
    href={urlRewrite(href)}
    title={title}
    sx={{ textDecoration: 'none' }}
  >
    {children}
  </MUILink>
);

export default Link;

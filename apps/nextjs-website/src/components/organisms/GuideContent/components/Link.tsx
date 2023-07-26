import { ReactNode } from 'react';
import MUILink from '@mui/material/Link';
import NextLink from 'next/link';

type LinkProps = {
  title?: string;
  href: string;
  children: ReactNode;
};

export const Link = ({ title, href, children }: LinkProps) => (
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

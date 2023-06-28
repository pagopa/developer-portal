import { ReactNode } from 'react';
import MUILink from '@mui/material/Link';
import NextLink from 'next/link';

type LinkProps = {
  title: string;
  href: string;
  children: ReactNode;
};

export const convertLink = (prefix: string, href: string) => {
  if (!href.startsWith('http')) {
    const updated = href.replace('README.md', '').replace('.md', '');
    return `${prefix}/${updated}`;
  } else {
    return href;
  }
};

const Link = (prefix: string) =>
  Object.assign(
    ({ title, href, children }: LinkProps) => (
      <MUILink
        component={NextLink}
        href={convertLink(prefix, href)}
        title={title}
      >
        {children}
      </MUILink>
    ),
    { displayName: 'Link' }
  );

export default Link;

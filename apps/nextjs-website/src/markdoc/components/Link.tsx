import { ReactNode } from 'react';
import MUILink from '@mui/material/Link';
import NextLink from 'next/link';
import { convertLink, removeEmojis } from '@/markdoc/helpers';

type LinkProps = {
  title: string;
  href: string;
  children: ReactNode;
};

const Link = (prefix: string) =>
  Object.assign(
    ({ title, href, children }: LinkProps) => (
      <MUILink
        component={NextLink}
        href={convertLink(prefix, href)}
        title={removeEmojis(title)}
        sx={{
          color: '#0073E6',
          fontSize: '16px',
          fontWeight: 700,
          textDecoration: 'none',
        }}
      >
        {typeof children === 'string' ? removeEmojis(children) : children}
      </MUILink>
    ),
    { displayName: 'Link' }
  );

export default Link;

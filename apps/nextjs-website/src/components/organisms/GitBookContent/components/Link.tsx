import { ReactNode } from 'react';
import MUILink from '@mui/material/Link';
import NextLink from 'next/link';
import { LinkProps } from 'gitbook-docs/markdoc/schema/link';
import { useTheme } from '@mui/material';

export const Link = ({ title, href, children }: LinkProps<ReactNode>) => {
  const { palette } = useTheme();
  return (
    <a href={href} title={title} style={{ color: palette.primary.main }}>
      {children}
    </a>
  );
};

export default Link;

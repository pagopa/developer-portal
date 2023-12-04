import { ReactNode } from 'react';
import { LinkProps } from 'gitbook-docs/markdoc/schema/link';
import { urlRewrite } from '@/helpers/url.helper';
import { useTheme } from '@mui/material';

export const Link = ({ title, href, children }: LinkProps<ReactNode>) => {
  const { palette } = useTheme();
  return (
    <a
      href={urlRewrite(href)}
      title={title}
      style={{ color: palette.primary.main }}
    >
      {children}
    </a>
  );
};

export default Link;

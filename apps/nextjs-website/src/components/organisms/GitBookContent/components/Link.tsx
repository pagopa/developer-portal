import { ReactNode } from 'react';
import { LinkProps } from 'gitbook-docs/markdoc/schema/link';
import { useTheme } from '@mui/material';

export const Link = ({ title, href, children }: LinkProps<ReactNode>) => {
  const { palette } = useTheme();
  return (
    <a
      href={href}
      title={title}
      style={{ wordWrap: 'break-word', color: palette.primary.main }}
    >
      {children}
    </a>
  );
};

export default Link;

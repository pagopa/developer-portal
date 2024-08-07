'use client';
import { ReactNode } from 'react';
import { LinkProps } from 'gitbook-docs/markdoc/schema/link';
import { Link, useTheme } from '@mui/material';

const ChatLink = ({ title, href, children }: LinkProps<ReactNode>) => {
  const { palette } = useTheme();
  return (
    <Link
      href={href}
      title={title}
      color={palette.primary.main}
      fontWeight={'600'}
    >
      {children}
    </Link>
  );
};

export default ChatLink;

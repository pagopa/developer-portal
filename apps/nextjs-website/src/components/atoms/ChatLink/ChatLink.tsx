'use client';
import { ReactNode } from 'react';
import { LinkProps } from 'gitbook-docs/markdoc/schema/link';
import { Link, useTheme } from '@mui/material';
import { isExternalLink } from '@/helpers/navigation.helpers';
import { OpenInNew } from '@mui/icons-material';

const ChatLink = ({ title, href, children }: LinkProps<ReactNode>) => {
  const { palette } = useTheme();
  const currentHost = typeof window !== 'undefined' ? window.location.host : '';
  const external = isExternalLink(currentHost, href);
  return (
    <Link
      href={href}
      title={title}
      color={palette.primary.main}
      display={'block'}
      fontWeight={'600'}
      target={external ? '_blank' : undefined}
      rel={external ? 'noreferrer' : undefined}
    >
      {children}
      {external && (
        <OpenInNew
          sx={{ ml: 0.5, fontSize: 'inherit', verticalAlign: 'middle' }}
        />
      )}
    </Link>
  );
};

export default ChatLink;

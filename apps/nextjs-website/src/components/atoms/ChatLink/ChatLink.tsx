'use client';
import { ReactNode } from 'react';
import { LinkProps } from 'gitbook-docs/markdoc/schema/link';
import { Link, useTheme } from '@mui/material';
import { isExternalLink } from '@/helpers/navigation.helpers';
import { OpenInNew } from '@mui/icons-material';

type ChatLinkProps = LinkProps<ReactNode> & { readonly className?: string };

const ChatLink = ({ title, href, children, className }: ChatLinkProps) => {
  const { palette } = useTheme();
  const currentHost = typeof window !== 'undefined' ? window.location.host : '';
  const external = isExternalLink(currentHost, href);
  return (
    <Link
      className={className}
      href={href}
      title={title}
      color={palette.primary.main}
      display={'inline-flex'}
      fontWeight={'600'}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      aria-label={
        external ? `${title || href} (opens in a new tab)` : undefined
      }
    >
      {children}
      {external && (
        <OpenInNew
          aria-hidden='true'
          focusable={false}
          sx={{ ml: 0.5, fontSize: 'inherit', verticalAlign: 'middle' }}
        />
      )}
    </Link>
  );
};

export default ChatLink;

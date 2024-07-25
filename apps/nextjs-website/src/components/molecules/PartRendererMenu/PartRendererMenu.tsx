'use client';
import { Part } from '@/lib/types/part';
import React, { ReactNode } from 'react';

import { Box, Typography } from '@mui/material';

import BlocksRendererClientMenu from '../BlocksRendererClientMenu/BlocksRendererClientMenu';
import { translations } from '@/_contents/translations';

type PartRendererMenuProps = {
  readonly parts: readonly Part[];
};

const PartRendererMenu = (props: PartRendererMenuProps): ReactNode | null => {
  return (
    <Box
      sx={{
        '& > br': {
          display: 'none',
        },
      }}
    >
      <Typography variant='h6' sx={{ marginBottom: '16px' }}>
        {translations.productGuidePage.onThisPage}
      </Typography>
      {props.parts.map((part) => {
        switch (part.component) {
          case 'blockRenderer':
            return <BlocksRendererClientMenu content={part.html} />;
          case 'codeBlock':
            return (
              <a
                href={`#${computeId('codeBlock', part.title)}`}
                style={{ textDecoration: 'none' }}
              >
                <Typography>{part.title}</Typography>
              </a>
            );
          case 'typography':
            if (['h1', 'h2', 'h3', 'h4'].includes(part?.variant ?? ''))
              return null;

            return (
              <a
                href={`#${computeId('typography', part.text)}`}
                style={{ textDecoration: 'none' }}
              >
                <Typography>{part.text}</Typography>
              </a>
            );
          default:
            return null;
        }
      })}
    </Box>
  );
};

export function refactorId(id: string | undefined): string {
  if (id === undefined) return '';
  return id
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\p{P}\p{Z}^$\n]/gu, '')
    .replace(/^\s*/, '')
    .normalize('NFD') // Split an accented letter in the base letter and the accent
    .replace(/[\u0300-\u036f]/g, '') // Remove all accents
    .replace(/ /g, '-'); // Replace spaces with -
}

export function computeId(type: string, children: ReactNode | string): string {
  if (typeof children === 'string') {
    return `${type}-${refactorId(children)}`;
  }

  if (!Array.isArray(children)) {
    // if children is react element and has props text return that
    if (children && typeof children === 'object' && 'props' in children) {
      const text = refactorId(children.props.text);
      return `${type}-${text}`;
    }

    return refactorId(children?.toString()) ?? '';
  }

  return children
    .map((child: ReactNode) => {
      return computeId(type, child);
    })
    .join('-');
}

export default PartRendererMenu;

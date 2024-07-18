'use client';
import { Part } from '@/lib/types/part';
import React, { ReactNode } from 'react';

import { Typography } from '@mui/material';

import BlocksRendererClientMenu from '../BlocksRendererClientMenu/BlocksRendererClientMenu';

type PartRendererMenuProps = {
  readonly parts: readonly Part[];
};

const PartRendererMenu = (props: PartRendererMenuProps): ReactNode | null => {
  return (
    <div>
      {props.parts.map((part) => {
        switch (part.component) {
          case 'alert':
            return (
              <a
                href={`#${computeId('alert', `${part.title}${part.text}`)}`}
                style={{ textDecoration: 'none' }}
              >
                <Typography>{part.title}</Typography>
              </a>
            );
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
            if (!part.variant?.includes('h')) return null;

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
    </div>
  );
};

export function computeId(type: string, children: ReactNode | string): string {
  if (typeof children === 'string') {
    return `${type} ${children}`;
  }

  if (!Array.isArray(children)) {
    // if children is react element and has props text return that
    if (children && typeof children === 'object' && 'props' in children) {
      const text = children.props.text;
    }

    return children?.toString() ?? '';
  }

  return children
    .map((child: ReactNode) => {
      return computeId(type, child);
    })
    .join('');
}

export default PartRendererMenu;

'use client';
import { Theme, Typography, useTheme } from '@mui/material';
import { BlocksContent, BlocksRenderer } from '@strapi/blocks-react-renderer';
import { SxProps } from '@mui/system';
import { computeId } from '../PartRendererMenu/PartRendererMenu';
import { ReactElement, ReactNode } from 'react';
import React from 'react';

type BlocksRendererClientMenuProps = {
  content?: BlocksContent;
  color?: 'contrastText' | 'main' | 'light' | 'dark';
  paragraphSx?: SxProps<Theme>;
  listStyle?: React.CSSProperties;
  imageStyle?: React.CSSProperties;
};

const BlocksRendererClientMenu = ({
  content,
  color,
}: BlocksRendererClientMenuProps) => {
  const { palette } = useTheme();

  if (!content) return null;

  const textColor = color ? palette.primary[color] : palette.text.primary;

  return (
    <BlocksRenderer
      content={content}
      blocks={{
        image: () => null,
        paragraph: () => null,
        heading: ({ children }) => (
          <a
            href={`#${computeId('blockRenderer', children)}`}
            style={{
              textDecoration: 'none',
              margin: 0,
              padding: 0,
              marginBottom: '16px',
            }}
          >
            <Typography color={textColor}>{children}</Typography>
          </a>
        ),
        list: () => null,
      }}
    />
  );
};

export default BlocksRendererClientMenu;

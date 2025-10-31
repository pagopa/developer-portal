'use client';
import { Theme, Typography, useTheme } from '@mui/material';
import { BlocksContent, BlocksRenderer } from '@strapi/blocks-react-renderer';
import { SxProps } from '@mui/system';
import { computeId } from '../PartRendererMenu/PartRendererMenu';
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
              fontSize: 15,
              margin: 0,
              marginBottom: '5px',
              padding: 0,
              textDecoration: 'none',
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

'use client';
import { Theme, Typography, useTheme } from '@mui/material';
import { BlocksContent, BlocksRenderer } from '@strapi/blocks-react-renderer';
import Image from 'next/image';
import { SxProps } from '@mui/system';
import { ReactNode } from 'react';
import { computeId } from '../PartRendererMenu/PartRendererMenu';

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
  paragraphSx,
  listStyle,
  imageStyle = {
    height: 'auto',
    width: '100%',
    maxWidth: '820px',
  },
}: BlocksRendererClientMenuProps) => {
  const { palette } = useTheme();

  if (!content) return null;

  const textColor = color ? palette.primary[color] : palette.text.primary;

  return (
    <BlocksRenderer
      content={content}
      blocks={{
        image: ({ image }) => null,
        paragraph: ({ children }) => null,
        heading: ({ children, level }) => (
          <a
            href={`#${computeId('blockRenderer', children)}`}
            style={{ textDecoration: 'none' }}
          >
            <Typography
              marginY={4}
              variant={`h${level}`}
              color={textColor}
              id={computeId('blockRenderer', children)}
            >
              {children}
            </Typography>
          </a>
        ),
        list: ({ children }) => null,
      }}
    />
  );
};

export default BlocksRendererClientMenu;

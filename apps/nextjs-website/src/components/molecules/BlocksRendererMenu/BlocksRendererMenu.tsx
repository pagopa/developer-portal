'use client';

import { Typography, useTheme } from '@mui/material';
import { BlocksContent, BlocksRenderer } from '@strapi/blocks-react-renderer';
import Image from 'next/image';
import { ReactNode } from 'react';
import { computeId } from '../BlocksRendererClient/BlocksRendererClient';

const BlocksRendererMenu = ({
  content,
  color,
  title,
  imageStyle = {},
}: {
  readonly content?: BlocksContent;
  color?: 'contrastText' | 'main' | 'light' | 'dark';
  imageStyle?: React.CSSProperties;
  title: string;
}) => {
  const { palette } = useTheme();

  if (!content) return null;

  const textColor = color ? palette.primary[color] : palette.text.primary;

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <Typography
        color={palette.text.secondary}
        fontSize={14}
        fontWeight={700}
        textTransform={'uppercase'}
        marginBottom={'18px'}
      >
        {title}
      </Typography>
      <BlocksRenderer
        content={content}
        blocks={{
          image: ({ image }) => null,
          paragraph: ({ children }) => null,
          heading: ({ children, level }) =>
            level == 3 || level == 2 ? (
              <a
                href={`#${computeId(children)}`}
                style={{ textDecoration: 'none' }}
              >
                <Typography color={textColor} id={computeId(children)}>
                  {children}
                </Typography>
              </a>
            ) : null,
        }}
      />
    </div>
  );
};

export default BlocksRendererMenu;

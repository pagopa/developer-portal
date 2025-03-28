'use client';
import { Link, Theme, Typography, useTheme } from '@mui/material';
import { BlocksContent, BlocksRenderer } from '@strapi/blocks-react-renderer';
import Image from 'next/image';
import { SxProps } from '@mui/system';
import { computeId } from '../PartRendererMenu/PartRendererMenu';
import { SITE_HEADER_HEIGHT } from '../SiteHeader/SiteHeader';
import CodeBlockPart from '../CodeBlockPart/CodeBlockPart';
import { ReactElement } from 'react';
import { PRODUCT_HEADER_HEIGHT } from '@/components/atoms/ProductHeader/ProductHeader';

type BlocksRendererClientProps = {
  content?: BlocksContent;
  color?: 'contrastText' | 'main' | 'light' | 'dark';
  paragraphSx?: SxProps<Theme>;
  listStyle?: React.CSSProperties;
  imageStyle?: React.CSSProperties;
};

const BlocksRendererClient = ({
  content,
  color,
  paragraphSx,
  listStyle,
  imageStyle = {
    height: 'auto',
    width: '100%',
    maxWidth: '820px',
  },
}: BlocksRendererClientProps) => {
  const { palette } = useTheme();

  if (!content) return null;

  const textColor = color ? palette.primary[color] : palette.text.primary;
  const scrollOffset = SITE_HEADER_HEIGHT + PRODUCT_HEADER_HEIGHT;

  return (
    <BlocksRenderer
      content={content}
      blocks={{
        link: ({ children, url }) => (
          <Link
            href={url}
            sx={{
              color: palette.primary.main,
              textDecoration: 'none',
              fontWeight: 600,
            }}
          >
            {children}
          </Link>
        ),
        image: ({ image }) => (
          <Image
            style={{
              marginBottom: 40,
              ...imageStyle,
            }}
            src={image.url}
            width={image.width}
            height={image.height}
            alt={image.alternativeText || ''}
          />
        ),
        paragraph: ({ children }) => (
          <Typography
            marginBottom={5}
            variant='body1'
            color={textColor}
            sx={paragraphSx}
          >
            {children}
          </Typography>
        ),
        heading: ({ children, level }) => (
          <div
            id={computeId('blockRenderer', children)}
            style={{
              marginTop: `-${scrollOffset}px`,
              paddingTop: `${scrollOffset}px`,
            }}
          >
            <Typography marginY={4} variant={`h${level}`} color={textColor}>
              {children}
            </Typography>
          </div>
        ),
        list: ({ children }) => {
          return <ul style={listStyle}>{children}</ul>;
        },
      }}
      modifiers={{
        code: ({ children }) => {
          return (
            <CodeBlockPart
              code={(children as ReactElement).props.children}
              showLineNumbers={false}
            />
          );
        },
      }}
    />
  );
};

export default BlocksRendererClient;

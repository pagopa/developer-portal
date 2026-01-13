'use client';
import { Link, Theme, Typography, useTheme } from '@mui/material';
import { BlocksContent, BlocksRenderer } from '@strapi/blocks-react-renderer';
import Image from 'next/image';
import { SxProps } from '@mui/system';
import { computeId } from '../PartRendererMenu/PartRendererMenu';
import CodeBlockPart from '../CodeBlockPart/CodeBlockPart';
import { ReactElement, isValidElement } from 'react';
import ContentHeading from '@/components/atoms/ContentHeading/ContentHeading';

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
          <ContentHeading
            level={level}
            id={computeId('blockRenderer', children)}
          >
            {children}
          </ContentHeading>
        ),
        list: ({ children }) => {
          return <ul style={listStyle}>{children}</ul>;
        },
        code: ({ children }) => {
          // Extract code string safely from children
          // eslint-disable-next-line functional/no-let
          let codeString = '';

          if (typeof children === 'string') {
            codeString = children;
          } else if (isValidElement(children)) {
            const reactElement = children as ReactElement<{
              children?: string | string[];
            }>;
            if (typeof reactElement.props.children === 'string') {
              codeString = reactElement.props.children;
            } else if (Array.isArray(reactElement.props.children)) {
              // Handle array of children, join them as text
              codeString = reactElement.props.children
                .filter((child: unknown) => typeof child === 'string')
                .join('');
            }
          }

          return (
            <CodeBlockPart code={codeString || ''} showLineNumbers={false} />
          );
        },
      }}
      modifiers={{
        code: ({ children }) => <code>{children}</code>,
      }}
    />
  );
};

export default BlocksRendererClient;

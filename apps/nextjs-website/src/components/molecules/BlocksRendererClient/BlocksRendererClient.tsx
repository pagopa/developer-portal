'use client';
import { Theme, Typography, useTheme } from '@mui/material';
import { BlocksContent, BlocksRenderer } from '@strapi/blocks-react-renderer';
import Image from 'next/image';
import { SxProps } from '@mui/system';

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
        image: ({ image }) => (
          <Image
            style={{
              marginBottom: 5,
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
        heading: ({ children }) => (
          <Typography
            marginBottom={2}
            component={'h2'}
            fontSize={'24px'}
            fontWeight={600}
            color={textColor}
          >
            {children}
          </Typography>
        ),
        list: ({ children }) => {
          return <ul style={listStyle}>{children}</ul>;
        },
      }}
    />
  );
};

export default BlocksRendererClient;

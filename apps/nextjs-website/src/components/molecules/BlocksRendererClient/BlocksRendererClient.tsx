'use client';

import { Typography, useTheme } from '@mui/material';
import { BlocksContent, BlocksRenderer } from '@strapi/blocks-react-renderer';
import Image from 'next/image';
import { ReactNode } from 'react';

type BlocksRendererClientProps = {
  content?: BlocksContent;
  color?: 'contrastText' | 'main' | 'light' | 'dark';
  imageStyle?: React.CSSProperties;
};

const BlocksRendererClient = ({
  content,
  color,
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
              marginBottom: '16px',
              ...imageStyle,
            }}
            src={image.url}
            width={image.width}
            height={image.height}
            alt={image.alternativeText || ''}
          />
        ),
        paragraph: ({ children }) => (
          <Typography marginBottom={2} variant='body1' color={textColor}>
            {children}
          </Typography>
        ),
        heading: ({ children, level }) => (
          <Typography marginY={4} variant={`h${level}`} color={textColor} id={computeId(children)}>
            {children}
          </Typography>
        ),
      }}
    />
  );
};

export function computeId(children: ReactNode): string {

  if(!Array.isArray(children)) {
    console.log(children);

    // if children is react element and has props text return that
    if(children.props?.text) {
      return children.props.text;
    }

    return children?.toString() ?? '';
  }

  return children.map((child: ReactNode) => { 
    return computeId(child);
  }).join('');

}

export default BlocksRendererClient;

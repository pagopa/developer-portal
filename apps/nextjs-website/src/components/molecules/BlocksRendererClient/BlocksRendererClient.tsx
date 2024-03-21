'use client';
import { Typography } from '@mui/material';
import { BlocksContent, BlocksRenderer } from '@strapi/blocks-react-renderer';
import Image from 'next/image';

const BlocksRendererClient = ({
  content,
}: {
  readonly content?: BlocksContent;
}) => {
  if (!content) return null;
  return (
    <BlocksRenderer
      content={content}
      blocks={{
        image: ({ image }) => (
          <Image
            src={image.url}
            width={image.width}
            height={image.height}
            alt={image.alternativeText || ''}
          />
        ),
        paragraph: ({ children }) => (
          <Typography variant='body1'>{children}</Typography>
        ),
        heading: ({ children, level }) => (
          <Typography variant={`h${level}`}>{children}</Typography>
        ),
      }}
    />
  );
};

export default BlocksRendererClient;

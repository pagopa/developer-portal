'use client';
import { Theme } from '@mui/material';
import { BlocksContent, BlocksRenderer } from '@strapi/blocks-react-renderer';
import { SxProps } from '@mui/system';
import { computeId } from '../PartRendererMenu/PartRendererMenu';
import React from 'react';
import Heading from '@/components/organisms/GuideInPageMenu/components/Heading';
import { headingLevelsToShowInMenu } from '@/config';
import { includes } from 'lodash';

type BlocksRendererClientMenuProps = {
  content?: BlocksContent;
  color?: 'contrastText' | 'main' | 'light' | 'dark';
  paragraphSx?: SxProps<Theme>;
  listStyle?: React.CSSProperties;
  imageStyle?: React.CSSProperties;
};

const BlocksRendererClientMenu = ({
  content,
}: BlocksRendererClientMenuProps) => {
  if (!content) return null;

  return (
    <BlocksRenderer
      content={content}
      blocks={{
        image: () => null,
        paragraph: () => null,
        heading: ({ children, level }) => {
          if (!includes(headingLevelsToShowInMenu, level)) return null;
          return (
            <Heading level={level} id={computeId('blockRenderer', children)}>
              {children}
            </Heading>
          );
        },
        list: () => null,
      }}
    />
  );
};

export default BlocksRendererClientMenu;

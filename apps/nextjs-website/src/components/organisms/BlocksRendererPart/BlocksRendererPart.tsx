'use client';
import React from 'react';
import { Box, SxProps, Theme } from '@mui/material';
import BlocksRendererClient from '@/components/molecules/BlocksRendererClient/BlocksRendererClient';
import { BlocksContent } from '@strapi/blocks-react-renderer';

export type BlocksRendererPartProps = {
  readonly html: BlocksContent;
  readonly paragraphSx?: SxProps<Theme>;
};

const BlocksRendererPart = ({ html, paragraphSx }: BlocksRendererPartProps) => {
  return (
    <Box component='div' mt={2}>
      <BlocksRendererClient content={html} paragraphSx={paragraphSx} />
    </Box>
  );
};

export default BlocksRendererPart;

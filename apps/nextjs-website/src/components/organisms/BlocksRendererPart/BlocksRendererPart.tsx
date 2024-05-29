'use client';
import React from 'react';
import { Box } from '@mui/material';
import BlocksRendererClient from '@/components/molecules/BlocksRendererClient/BlocksRendererClient';
import { BlocksContent } from '@strapi/blocks-react-renderer';

export type BlocksRendererPartProps = { html: BlocksContent };

const BlocksRendererPart = ({ html }: BlocksRendererPartProps) => {
  return (
    <Box component='div' mt={2}>
      <BlocksRendererClient content={html} />
    </Box>
  );
};

export default BlocksRendererPart;

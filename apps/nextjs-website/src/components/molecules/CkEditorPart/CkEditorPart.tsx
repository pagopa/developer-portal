'use client';
import React from 'react';
import { Box } from '@mui/material';
import DOMPurify from 'isomorphic-dompurify';

export type CkEditorPartProps = {
  content: string;
};

const CkEditorPart = ({ content }: CkEditorPartProps) => {
  return (
    <Box className={'container'}>
      <div
        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(content) }}
      ></div>
    </Box>
  );
};

export default CkEditorPart;

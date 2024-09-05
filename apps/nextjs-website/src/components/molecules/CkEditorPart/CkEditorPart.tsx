'use client';
import React from 'react';
import { Box } from '@mui/material';

export type CkEditorPartProps = {
  content: string;
};

const CkEditorPart = ({ content }: CkEditorPartProps) => {
  return (
    <Box className={'container'} sx={{}}>
      <div dangerouslySetInnerHTML={{ __html: content }}></div>
    </Box>
  );
};

export default CkEditorPart;

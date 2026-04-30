'use client';
import { ReactNode } from 'react';
import { ColumnsProps } from 'gitbook-docs/markdoc/schema/columns';
import { Box } from '@mui/material';

const Columns = ({ children }: ColumnsProps<ReactNode>) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        gap: '16px',
      }}
    >
      {children}
    </Box>
  );
};

export default Columns;

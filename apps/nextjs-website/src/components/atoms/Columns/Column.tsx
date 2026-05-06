'use client';
import { ReactNode } from 'react';
import { ColumnProps } from 'gitbook-docs/markdoc/schema/columns';
import { Box } from '@mui/material';

const Column = ({ children, width }: ColumnProps<ReactNode>) => {
  const normalizedWidth = width?.endsWith('%') ? width : '100%';

  return (
    <Box
      sx={{
        display: 'flex',
        width: { xs: 'auto', sm: normalizedWidth },
        flexDirection: 'column',
        gap: '16px',
      }}
    >
      {children}
    </Box>
  );
};

export default Column;

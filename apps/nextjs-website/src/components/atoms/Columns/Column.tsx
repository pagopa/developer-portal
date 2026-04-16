'use client';
import { ReactNode } from 'react';
import { ColumnProps } from 'gitbook-docs/markdoc/schema/columns';
import { Box, useTheme } from '@mui/material';

const Column = ({ children, width }: ColumnProps<ReactNode>) => {
  const { palette } = useTheme();
  return (
    <Box sx={{ display: 'flex', width: { xs: 'auto', sm: width }, flexDirection: 'column', gap: '16px' }}>
      {children}
    </Box>
  );
};

export default Column;

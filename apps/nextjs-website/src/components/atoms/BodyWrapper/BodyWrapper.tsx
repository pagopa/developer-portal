'use client';
import React from 'react';
import { useTheme } from '@mui/material';

const BodyWrapper = ({ children }: { children: React.ReactNode }) => {
  const { palette } = useTheme();

  return (
    <body
      style={{
        backgroundColor: palette.common.white,
      }}
    >
      {children}
    </body>
  );
};

export default BodyWrapper;

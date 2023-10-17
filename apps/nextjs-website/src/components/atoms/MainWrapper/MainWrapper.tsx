'use client';
import React from 'react';
import { useTheme } from '@mui/material';

const MainWrapper = ({ children }: { children: React.ReactNode }) => {
  const { palette } = useTheme();

  return (
    <main
      style={{
        backgroundColor: palette.background.paper,
      }}
    >
      {children}
    </main>
  );
};

export default MainWrapper;

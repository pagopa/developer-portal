'use client';
import { Box } from '@mui/material';
import React from 'react';

type PageBackgroundWrapperProps = {
  children?: React.ReactNode | React.ReactNode[];
};

const PageBackgroundWrapper = ({ children }: PageBackgroundWrapperProps) => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100vw',
        minHeight: '616px',
        backgroundImage: 'url(/images/hero.jpg)',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundPosition: 'bottom right',
      }}
    >
      {children}
    </Box>
  );
};

export default PageBackgroundWrapper;

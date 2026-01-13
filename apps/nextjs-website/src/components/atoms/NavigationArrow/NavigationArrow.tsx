'use client';
import ArrowBack from '@mui/icons-material/ArrowBack';
import ArrowForward from '@mui/icons-material/ArrowForward';
import { Box, Button, useTheme } from '@mui/material';
import React, { createElement } from 'react';

type NavigationArrowProps = {
  readonly direction: 'right' | 'left';
  readonly hidden: boolean;
};

const NavigationArrow = ({ direction, hidden }: NavigationArrowProps) => {
  const { palette } = useTheme();
  if (hidden) {
    return null;
  }

  const boxSx = direction === 'right' ? { right: 20 } : { left: 20 };
  const arrowIcon = createElement(
    direction === 'right' ? ArrowForward : ArrowBack,
    { sx: { color: palette.common.white, height: 12, width: 12 } }
  );

  return (
    <Box visibility={{ xs: 'hidden', sm: 'visible' }}>
      <Button
        sx={{
          ...boxSx,
          zIndex: 10,
          position: 'absolute',
          top: '45%',
          borderRadius: 100,
          backgroundColor: palette.text.primary,
          height: 14,
          width: 14,
          padding: 2,
          minWidth: 0,
          sm: {
            display: 'none',
          },
        }}
      >
        {arrowIcon}
      </Button>
    </Box>
  );
};

export default NavigationArrow;

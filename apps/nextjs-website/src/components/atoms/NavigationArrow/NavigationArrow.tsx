import { ArrowBack, ArrowForward } from '@mui/icons-material';
import { Box, Container } from '@mui/material';
import { ButtonNaked } from '@pagopa/mui-italia';
import React, { createElement } from 'react';

type NavigationArrowProps = {
  readonly direction: 'right' | 'left';
  readonly hidden: boolean;
};

const NavigationArrow = ({ direction, hidden }: NavigationArrowProps) => {
  if (hidden) {
    return null;
  }

  const boxSx = direction === 'right' ? { right: 20 } : { left: 20 };
  const arrowIcon = createElement(
    direction === 'right' ? ArrowForward : ArrowBack,
    { sx: { color: 'white', height: 12, width: 12 } }
  );

  return (
    <Box visibility={{ xs: 'hidden', sm: 'visible' }}>
      <ButtonNaked
        sx={{
          ...boxSx,
          zIndex: 10,
          position: 'absolute',
          top: '45%',
          borderRadius: 100,
          backgroundColor: 'black',
          opacity: 0.9,
          height: 14,
          width: 14,
          padding: 2,
          sm: {
            display: 'none',
          },
        }}
        p={1}
      >
        {arrowIcon}
      </ButtonNaked>
    </Box>
  );
};

export default NavigationArrow;

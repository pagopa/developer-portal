'use client';
import Box, { type BoxProps } from '@mui/material/Box';
import Grid, { type GridProps } from '@mui/material/Grid';
import { Container } from '@mui/system';
import { type Generic } from '../types/components';
import { isJSX } from '../utils';
import React from 'react';

interface Props {
  alignItems?: GridProps['alignItems'];
  background?: string | Generic;
  children: React.ReactNode;
  direction?: GridProps['direction'];
  py?: BoxProps['py'];
  px?: BoxProps['px'];
  spacing?: GridProps['spacing'];
  sx?: GridProps['sx'];
}

const EContainer = (props: Props) => {
  const {
    alignItems,
    background,
    children,
    direction = 'row',
    py = {},
    px,
    spacing,
    sx,
  } = props;
  const backgroundIsJSX = isJSX(background);

  return (
    <Box
      component='section'
      sx={{ px: { xs: 4 }, position: 'relative', overflow: 'hidden' }}
      py={py}
      px={px}
      bgcolor={!backgroundIsJSX ? background : undefined}
    >
      {backgroundIsJSX && background}
      <Container maxWidth='lg' disableGutters>
        <Grid
          container
          direction={direction}
          spacing={spacing}
          alignItems={alignItems}
          sx={sx}
        >
          {children}
        </Grid>
      </Container>
    </Box>
  );
};

export default EContainer;

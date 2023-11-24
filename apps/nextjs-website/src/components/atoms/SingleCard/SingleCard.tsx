'use client';
import { Box, Card, Stack, Typography } from '@mui/material';
import React from 'react';

type SingleCardProps = {
  icon?: React.ReactNode;
  title?: string;
  children?: React.ReactNode | React.ReactNode[];
  cta?: React.ReactNode;
};

const SingleCard = ({ icon, title, children, cta }: SingleCardProps) => {
  return (
    <Box
      component='section'
      width={{ xs: '90vw', md: '60vw', lg: '35vw' }}
      marginY={{ xs: 12, md: 8, lg: 4 }}
    >
      <Card variant='outlined'>
        <Stack
          gap={4}
          direction='column'
          justifyContent='center'
          padding={{ xs: 3, md: 4 }}
        >
          <Stack display='flex' alignItems='center'>
            {icon}
          </Stack>
          {title && (
            <Typography variant='h4' textAlign='center'>
              {title}
            </Typography>
          )}
          {children}
          {cta && (
            <Stack direction='row' justifyContent='center'>
              {cta}
            </Stack>
          )}
        </Stack>
      </Card>
    </Box>
  );
};

export default SingleCard;

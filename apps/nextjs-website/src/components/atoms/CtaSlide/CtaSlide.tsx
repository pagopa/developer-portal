'use client';
import { Box, Stack, Typography, useTheme } from '@mui/material';
import { ButtonNaked } from '@pagopa/mui-italia';
import Image from 'next/image';
import Link from 'next/link';
import React, { ReactNode } from 'react';

export type CtaSlideProps = {
  readonly title: string;
  readonly color?: string;
  readonly cta?: {
    readonly label: string;
    readonly href: string;
    readonly variant?: 'text' | 'contained' | 'outlined';
  };
  readonly child?: ReactNode;
  readonly backgroundImage?: string;
};

const CtaSlide = ({
  title,
  color,
  cta,
  child,
  backgroundImage = '/images/hero-swiper.png',
}: CtaSlideProps) => {
  const { palette } = useTheme();
  const textColor = color || palette.primary.contrastText;

  return (
    <Stack
      height={{ xs: 468, sm: 560 }}
      justifyContent={'center'}
      alignItems={'center'}
      direction={'row'}
    >
      <Stack
        px={{ xs: 4, md: 30 }}
        direction={'column'}
        textAlign={'center'}
        zIndex={10}
      >
        <Box mb={4}>{child}</Box>
        <Typography
          fontSize={{ xs: 48, md: 58 }}
          variant={'h1'}
          color={textColor}
        >
          {title}
        </Typography>
        <Box mt={4}>
          {cta && (
            <ButtonNaked
              component={Link}
              href={cta.href}
              color={'negative'}
              variant={cta.variant || 'contained'}
            >
              {cta.label}
            </ButtonNaked>
          )}
        </Box>
      </Stack>
      <Box zIndex={0} position={'absolute'} height={'100%'} width={'100%'}>
        <Image
          style={{ objectFit: 'cover' }}
          src={backgroundImage}
          alt={title}
          fill={true}
        />
      </Box>
    </Stack>
  );
};

export default CtaSlide;

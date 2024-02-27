'use client';
import { Box, Stack, Typography, useTheme } from '@mui/material';
import { ButtonNaked } from '@pagopa/mui-italia';
import Image from 'next/image';
import Link from 'next/link';
import React, { ReactNode } from 'react';

export type CtaSlideProps = {
  readonly title: string;
  readonly titleColor?: 'contrastText' | 'main' | 'light' | 'dark' | null;
  readonly callToAction?: {
    readonly variant?: 'text' | 'contained' | 'outlined';
    readonly link: {
      readonly href: string;
      readonly text: string;
      readonly target?: '_self' | '_blank' | '_parent' | '_top' | null;
    };
  } | null;
  readonly child?: ReactNode;
  readonly backgroundImage?: {
    readonly name: string;
    readonly width: number;
    readonly height: number;
    readonly ext: string;
    readonly mime: string;
    readonly url: string;
  };
};

const CtaSlide = ({
  title,
  titleColor: color,
  callToAction: cta,
  child,
  backgroundImage = {
    name: 'hero-swiper.png',
    width: 1920,
    height: 1080,
    ext: '.png',
    mime: 'image/png',
    url: '/images/hero-swiper.png',
  },
}: CtaSlideProps) => {
  const { palette } = useTheme();
  const textColor = color
    ? palette.primary[color]
    : palette.primary.contrastText;

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
        {child && <Box mb={4}>{child}</Box>}
        <Typography
          fontSize={{
            xs: 'clamp(36px, 8vw, 48px)',
            md: 'clamp(48px, 10vw, 58px)',
          }}
          variant={'h1'}
          color={textColor}
        >
          {title}
        </Typography>
        <Box mt={4}>
          {cta && (
            <ButtonNaked
              component={Link}
              href={cta.link.href}
              color={'negative'}
              variant={cta.variant || 'contained'}
              sx={{ mb: 6 }}
              target={cta.link.target ?? '_self'}
            >
              {cta.link.text}
            </ButtonNaked>
          )}
        </Box>
      </Stack>
      {backgroundImage && (
        <Box zIndex={0} position={'absolute'} height={'100%'} width={'100%'}>
          <Image
            style={{ objectFit: 'cover' }}
            src={backgroundImage.url}
            alt={title}
            fill={true}
          />
        </Box>
      )}
    </Stack>
  );
};

export default CtaSlide;

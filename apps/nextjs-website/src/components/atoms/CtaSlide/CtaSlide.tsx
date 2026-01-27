'use client';
import { Media } from '@/lib/types/media';
import { Box, Stack, Typography, useTheme } from '@mui/material';
import { ButtonNaked } from '@/components/atoms/ButtonNaked/ButtonNaked';
import { BlocksContent } from '@strapi/blocks-react-renderer';
import Image from 'next/image';
import Link from 'next/link';
import React, { ReactNode } from 'react';

export type CtaSlideProps = {
  readonly title: string;
  readonly subhead?: BlocksContent;
  readonly subheadColor?: 'contrastText' | 'main' | 'light' | 'dark';
  readonly titleColor?: 'contrastText' | 'main' | 'light' | 'dark';
  readonly callToAction?: {
    readonly variant?: 'text' | 'contained' | 'outlined';
    readonly link: {
      readonly href: string;
      readonly text: string;
      readonly target?: '_self' | '_blank' | '_parent' | '_top';
    };
  };
  readonly child?: ReactNode;
  readonly backgroundImage?: Media;
};

const CtaSlide = ({
  title,
  titleColor: color,
  callToAction: cta,
  child,
  backgroundImage = {
    name: 'hero-swiper.png',
    alternativeText: undefined,
    caption: undefined,
    size: 10,
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

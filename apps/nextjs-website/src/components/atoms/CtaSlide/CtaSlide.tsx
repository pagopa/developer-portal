'use client';
import { Box, Stack } from '@mui/material';
import { ButtonNaked } from '@pagopa/mui-italia';
import Image from 'next/image';
import Link from 'next/link';
import React, { ReactNode } from 'react';
import { type BlocksContent } from '@strapi/blocks-react-renderer';
import BlockRendererClient from '@/components/molecules/BlockRendererClient/BlockRendererClient';

export type CtaSlideProps = {
  readonly subhead: BlocksContent;
  readonly color?: string | null;
  readonly variant?: 'text' | 'contained' | 'outlined' | null;
  readonly cta?: {
    readonly text: string;
    readonly href: string;
    readonly target?: '_self' | '_blank' | '_parent' | '_top' | null;
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
  subhead,
  cta,
  variant,
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
        <BlockRendererClient content={subhead} />
        <Box mt={4}>
          {cta && (
            <ButtonNaked
              component={Link}
              href={cta.href}
              color={'negative'}
              variant={variant || 'contained'}
              sx={{ mb: 6 }}
            >
              {cta.text}
            </ButtonNaked>
          )}
        </Box>
      </Stack>
      <Box zIndex={0} position={'absolute'} height={'100%'} width={'100%'}>
        <Image
          style={{ objectFit: 'cover' }}
          src={backgroundImage.url}
          fill={true}
          alt={backgroundImage.name}
        />
      </Box>
    </Stack>
  );
};

export default CtaSlide;

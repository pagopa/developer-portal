'use client';
import { Box, Stack, Typography, useTheme } from '@mui/material';
import { ButtonNaked } from '@pagopa/mui-italia';
import Image from 'next/image';
import Link from 'next/link';
import React, { ReactNode } from 'react';
import { type BlocksContent } from '@strapi/blocks-react-renderer';
import { buildEnv } from '@/config';
import BlockRendererClient from '@/components/molecules/BlockRendererClient/BlockRendererClient';

export type CtaSlideProps = {
  readonly subhead: string | BlocksContent;
  readonly color?: string | null;
  readonly variant?: 'text' | 'contained' | 'outlined' | null;
  readonly cta?: {
    readonly text: string;
    readonly href: string;
    readonly target?: '_self' | '_blank' | '_parent' | '_top' | null;
  } | null;
  readonly child?: ReactNode;
  readonly backgroundImage?: string | BlocksContent | null;
};

const CtaSlide = ({
  subhead,
  color,
  cta,
  variant,
  child,
  backgroundImage = '/images/hero-swiper.png',
}: CtaSlideProps) => {
  const { palette } = useTheme();
  const textColor = color || palette.primary.contrastText;
  const {
    config: { FETCH_FROM_STRAPI: fetchFromStrapi },
  } = buildEnv;

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
        {fetchFromStrapi ? (
          <BlockRendererClient content={subhead as BlocksContent} />
        ) : (
          <Typography
            fontSize={{
              xs: 'clamp(36px, 8vw, 48px)',
              md: 'clamp(48px, 10vw, 58px)',
            }}
            variant={'h1'}
            color={textColor}
          >
            {subhead as string}
          </Typography>
        )}
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
        {fetchFromStrapi ? (
          <BlockRendererClient content={backgroundImage as BlocksContent} />
        ) : (
          <Image
            style={{ objectFit: 'cover' }}
            src={backgroundImage as string}
            alt={subhead as string}
            fill={true}
          />
        )}
      </Box>
    </Stack>
  );
};

export default CtaSlide;

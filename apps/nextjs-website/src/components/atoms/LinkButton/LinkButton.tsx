'use client';
import { ArrowForward } from '@mui/icons-material';
import { Link as LinkMui, Stack, Typography } from '@mui/material';
import Link from 'next/link';
import React from 'react';

type LinkButtonProps = {
  readonly href?: string;
  readonly label: string;
  readonly size?: number;
  readonly width?: string;
  readonly disabled?: boolean;
};

const LinkButton = ({
  label,
  href,
  size = 18,
  width,
  disabled = false,
}: LinkButtonProps) => {
  const labelComponent = (
    <Typography
      fontSize={size}
      fontWeight={700}
      color={disabled ? 'lightgray' : 'inherit'}
      sx={{
        '&::first-letter': {
          textTransform: 'capitalize',
        },
      }}
    >
      {label}
    </Typography>
  );

  return (
    <Stack
      mt={2}
      direction='row'
      alignItems='center'
      color='primary.main'
      width={width}
    >
      {disabled ? (
        labelComponent
      ) : (
        <LinkMui
          component={Link}
          color='primary.main'
          underline='none'
          href={href || '#'}
          aria-label={label}
          title={label}
        >
          {labelComponent}
        </LinkMui>
      )}
      <ArrowForward
        sx={{
          color: disabled ? 'lightgray' : 'primary.main',
          height: 25,
          width: 25,
        }}
      />
    </Stack>
  );
};

export default LinkButton;

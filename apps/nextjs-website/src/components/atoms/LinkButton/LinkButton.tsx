'use client';
import ArrowForward from '@mui/icons-material/ArrowForward';
import { Link as LinkMui, Stack, Typography } from '@mui/material';
import Link from 'next/link';
import React from 'react';

type LinkButtonProps = {
  readonly color?: string;
  readonly disabledColor?: string;
  readonly href?: string;
  readonly label: string;
  readonly size?: number;
  readonly width?: string;
  readonly disabled?: boolean;
};

const LinkButton = ({
  color = 'inherit',
  disabledColor = 'lightgray',
  label,
  href,
  size = 14,
  width,
  disabled = false,
}: LinkButtonProps) => {
  const labelComponent = (
    <Typography
      fontSize={size}
      fontWeight={700}
      color={disabled ? disabledColor : color}
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
          color: disabled ? disabledColor : color,
          marginLeft: 0.5,
          height: 24,
          width: 24,
        }}
      />
    </Stack>
  );
};

export default LinkButton;

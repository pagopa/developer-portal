import { ArrowForward } from '@mui/icons-material';
import { Link as LinkMui, Stack, Typography } from '@mui/material';
import Link from 'next/link';
import React from 'react';

type LinkButtonProps = {
  readonly label: string;
  readonly href: string;
  readonly width?: string;
};

const LinkButton = ({ label, href, width }: LinkButtonProps) => {
  return (
    <Stack
      mt={2}
      direction='row'
      alignItems='center'
      color='primary.main'
      width={width}
    >
      <LinkMui
        component={Link}
        color='primary.main'
        underline='none'
        textTransform='capitalize'
        href={href}
        aria-label={label}
        title={label}
      >
        <Typography fontSize={18} fontWeight={700} color='inherit'>
          {label}
        </Typography>
      </LinkMui>
      <ArrowForward sx={{ color: 'primary.main', height: 25, width: 25 }} />
    </Stack>
  );
};

export default LinkButton;

'use client';
import LinkButton from '@/components/atoms/LinkButton/LinkButton';
import EContainer from '@/editorialComponents/EContainer/EContainer';
import { Stack, Typography } from '@mui/material';
import { Variant } from '@mui/material/styles/createTypography';
import React, { ReactNode } from 'react';

type SectionTitleProps = {
  title: string;
  subtitle?: string;
  cta?: {
    label: string;
    href: string;
  };
  children?: ReactNode | ReactNode[];
  margin?: number | string;
  variant?: Variant;
};

const SectionTitle = ({
  title,
  subtitle,
  cta,
  margin,
  children,
  variant = 'h4',
}: SectionTitleProps) => {
  return (
    <EContainer>
      <Stack
        m={margin}
        spacing={2}
        direction='column'
        justifyContent={{ sm: 'space-between', md: 'center' }}
        alignItems='flex-start'
      >
        {title && (
          <Typography
            variant={variant}
            sx={{
              paddingBottom: '16px',
              width: '100%',
              fontSize: '2rem !important',
              lineHeight: '1.125 !important',
            }}
          >
            {title}
          </Typography>
        )}
        {subtitle && (
          <Typography
            variant='body1'
            style={{ marginTop: 0 }}
            marginBottom={2}
            width={{ xs: '100%', md: '60%' }}
          >
            {subtitle}
          </Typography>
        )}
        {cta && <LinkButton href={cta.href} label={cta.label} />}
      </Stack>
      {children}
    </EContainer>
  );
};

export default SectionTitle;

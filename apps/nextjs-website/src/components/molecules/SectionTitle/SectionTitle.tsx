'use client';
import LinkButton from '@/components/atoms/LinkButton/LinkButton';
import EContainer from '@/editorialComponents/EContainer/EContainer';
import { Stack, Typography } from '@mui/material';
import React, { ReactNode } from 'react';

type SectionTitleProps = {
  title: string;
  subtitle?: string;
  cta?: {
    label: string;
    href: string;
  };
  children?: ReactNode | ReactNode[];
  margin?: number;
};

const SectionTitle = ({
  title,
  subtitle,
  cta,
  margin,
  children,
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
          <Typography variant='h4' mb={2} width='100%'>
            {title}
          </Typography>
        )}
        {subtitle && (
          <Typography variant='body1' mb={2} width={{ xs: '100%', md: '60%' }}>
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

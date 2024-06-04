'use client';
import { Stack, Typography, useTheme } from '@mui/material';
import React from 'react';

type StatItem = {
  title: string;
  subtitle?: string;
  description?: string;
};

type StatsProps = {
  items: StatItem[];
  maxWidth?: number;
  useDarkTheme?: boolean;
};

const Stats = ({ items, maxWidth = 150, useDarkTheme = false }: StatsProps) => {
  const { palette } = useTheme();

  const titleColor = useDarkTheme ? palette.common.white : palette.primary.main;
  const textColor = useDarkTheme ? palette.common.white : palette.text.primary;
  const bgColor = useDarkTheme
    ? palette.primary.main
    : palette.background.paper;

  return (
    <Stack
      flexDirection={{ xs: 'column', sm: 'row' }}
      bgcolor={bgColor}
      justifyContent={'space-between'}
      alignItems={'center'}
      gap={4}
      paddingY={8}
      paddingX={{ xs: 4, sm: 8, md: 24 }}
    >
      {items.map(({ title, subtitle, description }, index) => (
        <Stack
          key={index}
          flex={1}
          gap={1}
          flexDirection={'column'}
          textAlign={'center'}
          justifyContent={'start'}
          maxWidth={maxWidth}
        >
          <Typography
            marginBottom={3}
            fontWeight={700}
            color={titleColor}
            variant='h3'
          >
            {title}
          </Typography>
          {subtitle && (
            <Typography
              fontWeight={700}
              color={textColor}
              component={'p'}
              variant='h6'
            >
              {subtitle}
            </Typography>
          )}
          {description && (
            <Typography color={textColor} component={'p'} variant='body1'>
              {description}
            </Typography>
          )}
        </Stack>
      ))}
    </Stack>
  );
};

export default Stats;

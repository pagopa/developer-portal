'use client';
import EContainer from '@/editorialComponents/EContainer/EContainer';
import { Box, Stack, Typography, useTheme } from '@mui/material';
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
    : palette.background.default;

  return (
    <Box bgcolor={bgColor}>
      <EContainer>
        <Stack
          flexDirection={{ xs: 'column', sm: 'row' }}
          justifyContent={'space-between'}
          alignItems={'center'}
          gap={4}
          paddingTop={{ xs: '2.5rem', sm: '75px' }}
          paddingBottom={{ xs: '2.5rem', sm: '104px' }}
          width={'100%'}
        >
          {items.map(({ title, subtitle, description }, index) => (
            <Stack
              key={index}
              flex={1}
              flexDirection={'column'}
              textAlign={'center'}
              justifyContent={'start'}
              maxWidth={maxWidth}
            >
              <Typography
                marginBottom={'.7rem'}
                fontSize={50}
                fontWeight={700}
                color={titleColor}
              >
                {title}
              </Typography>
              {subtitle && (
                <Typography fontWeight={700} color={textColor} variant='h6'>
                  {subtitle}
                </Typography>
              )}
              {description && (
                <Typography
                  color={textColor}
                  fontWeight={600}
                  fontSize={24}
                  lineHeight={1.2}
                >
                  {description}
                </Typography>
              )}
            </Stack>
          ))}
        </Stack>
      </EContainer>
    </Box>
  );
};

export default Stats;

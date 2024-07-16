'use client';
import EContainer from '@/editorialComponents/EContainer/EContainer';
import { Box, Stack, Typography, useTheme } from '@mui/material';
import React from 'react';

type StatItem = {
  title: string;
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
          gap={4.2}
          paddingTop={{ xs: '2.2rem', sm: '75px' }}
          paddingBottom={{ xs: '2.6rem', sm: '104px' }}
          width={'100%'}
        >
          {items.map(({ title, description }, index) => (
            <Stack
              key={index}
              flex={1}
              flexDirection={'column'}
              textAlign={'center'}
              justifyContent={'start'}
              maxWidth={{ xs: 311, sm: maxWidth }}
            >
              <Typography
                marginBottom={{ xs: '.3rem', sm: '.7rem' }}
                fontSize={{ xs: 32, sm: 50 }}
                fontWeight={700}
                color={titleColor}
              >
                {title}
              </Typography>
              {description && (
                <Typography
                  color={textColor}
                  fontWeight={{ xs: 700, sm: 600 }}
                  fontSize={{ xs: 22, sm: 24 }}
                  lineHeight={{ xs: 1.3, sm: 1.2 }}
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

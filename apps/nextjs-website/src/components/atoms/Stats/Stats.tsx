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
  statsSource?: string;
};

const Stats = ({
  items,
  statsSource,
  maxWidth = 150,
  useDarkTheme = false,
}: StatsProps) => {
  const { palette } = useTheme();

  const titleColor = useDarkTheme ? palette.common.white : palette.primary.main;
  const textColor = useDarkTheme ? palette.common.white : palette.text.primary;
  const bgColor = useDarkTheme
    ? palette.primary.main
    : palette.background.default;

  return (
    <Box bgcolor={bgColor}>
      <EContainer
        containerSx={{
          paddingTop: { xs: '2.2rem', sm: '4.688rem' },
          paddingBottom: {
            xs: statsSource ? '2.2rem' : '2.6rem',
            sm: statsSource ? '2.5rem' : '6.5rem',
          },
        }}
      >
        <Stack
          flexDirection={{ xs: 'column', sm: 'row' }}
          justifyContent={items.length > 2 ? 'space-between' : 'space-around'}
          alignItems={{ xs: 'center', sm: 'start' }}
          gap={4.2}
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
                fontSize={{ xs: '2rem', sm: '3.125rem' }}
                fontWeight={700}
                color={titleColor}
              >
                {title}
              </Typography>
              {description && (
                <Typography
                  color={textColor}
                  fontWeight={{ xs: 700, sm: 600 }}
                  fontSize={{ xs: '1.375rem', sm: '1.5rem' }}
                  lineHeight={{ xs: 1.3, sm: 1.2 }}
                >
                  {description}
                </Typography>
              )}
            </Stack>
          ))}
        </Stack>
        {statsSource && (
          <Box
            flexDirection={{ xs: 'column', sm: 'row' }}
            alignItems={'center'}
            paddingTop={{ xs: '2.2rem', sm: '3.5rem' }}
            width={'100%'}
          >
            <Typography
              variant='body2'
              color={textColor}
              sx={{ textAlign: 'center', width: '100%' }}
            >
              {statsSource}
            </Typography>
          </Box>
        )}
      </EContainer>
    </Box>
  );
};

export default Stats;

'use client';
import React from 'react';
import { Grid, Typography, useTheme } from '@mui/material';
import { type FeatureItem, FeatureStackItem } from './FeatureStackItem';
import EContainer from '@/editorialComponents/EContainer/EContainer';

export interface FeatureProps {
  title: string;
  subtitle?: string;
  items: FeatureItem[];
  background?: string;
  useDarkTheme?: boolean;
}

const Feature = (props: FeatureProps) => {
  const { title, subtitle, items, background, useDarkTheme = false } = props;
  const { palette } = useTheme();
  const theme = palette.mode;
  const isDarkMode = useDarkTheme || theme !== 'light';

  const themeStyle = isDarkMode ? 'background.paper' : 'text.primary';
  const themeStyleBg = isDarkMode ? 'primary.dark' : 'background.paper';

  return (
    <EContainer
      background={background ?? themeStyleBg}
      py={{
        xs: 4,
        sm: 4,
        md: 8,
      }}
    >
      <Grid textAlign={'center'} item xs={12}>
        <Typography variant='h4' color={themeStyle} textAlign='center'>
          {title}
        </Typography>
        {subtitle && (
          <Typography
            px={{ xs: 2, md: '30%' }}
            mt={2}
            variant='body1'
            color={themeStyle}
            textAlign='center'
          >
            {subtitle}
          </Typography>
        )}
      </Grid>
      <Grid item mt={8}>
        <Grid container justifyContent='center'>
          {items.map((item, index) => (
            <Grid
              md={items.length < 4 ? 4 : 3}
              px={{ xs: 4, md: items.length < 4 ? 7 : 2 }}
              item
              key={index}
            >
              <FeatureStackItem
                theme={theme}
                item={item}
                useDarkTheme={useDarkTheme}
              />
            </Grid>
          ))}
        </Grid>
      </Grid>
    </EContainer>
  );
};

export default Feature;

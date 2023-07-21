// TODO: Remove when @pagopa/pagopa-editorial-components Abstract component will be ready
import React from 'react';
import { Grid, Typography } from '@mui/material';
import { type FeatureItem, FeatureStackItem } from './FeatureStackItem';
import EContainer from '@pagopa/pagopa-editorial-components/dist/components/EContainer';

export interface FeatureProps {
  title: string;
  subtitle?: string;
  items: FeatureItem[];
  theme: 'dark' | 'light';
  background?: string;
}

const Feature = (props: FeatureProps) => {
  const { title, subtitle, items, theme, background } = props;

  const themeStyle = theme === 'light' ? 'text.primary' : 'background.paper';
  const themeStyleBg = theme === 'light' ? 'background.paper' : 'primary.dark';

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
              <FeatureStackItem theme={theme} item={item} />
            </Grid>
          ))}
        </Grid>
      </Grid>
    </EContainer>
  );
};

export default Feature;

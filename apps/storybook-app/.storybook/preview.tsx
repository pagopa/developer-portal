import React, { ReactNode } from 'react';
import { Decorator } from '@storybook/nextjs';
import { storybookTheme } from './theme';
import { ThemeProvider, Box } from '@mui/material';
import { theme as muiItaliaTheme } from './muiTheme';

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  layout: 'fullscreen',
  controls: {
    expanded: true,
    matchers: {
      date: /Date$/,
    },
  },
  docs: {
    storybookTheme,
  },
};

const StoryContainer = ({ children }: { children: ReactNode }) => (
  <Box sx={{ backgroundColor: 'background.paper' }} data-chromatic='ignore'>
    {children}
  </Box>
);

export const withTheme: Decorator = (Story, context) => (
  <ThemeProvider theme={muiItaliaTheme}>
    <StoryContainer>
      <Story />
    </StoryContainer>
  </ThemeProvider>
);

export const decorators = [withTheme];

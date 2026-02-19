import React, { ReactNode } from 'react';
import { Decorator } from '@storybook/nextjs';
import { storybookTheme } from './theme';
import { ThemeProvider, Box } from '@mui/material';
import { theme as muiItaliaTheme } from './muiTheme';
import '@fontsource/titillium-web/400.css';
import '@fontsource/titillium-web/600.css';
import '@fontsource/titillium-web/700.css';
import { Global, css } from '@emotion/react';

const GlobalStyles = () => (
  <Global
    styles={css`
      :root {
        --font-titillium-web: 'Titillium Web', sans-serif;
      }
    `}
  />
);

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
    <GlobalStyles />
    <StoryContainer>
      <Story />
    </StoryContainer>
  </ThemeProvider>
);

export const decorators = [withTheme];

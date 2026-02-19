import React, { ReactNode } from 'react';
import { Decorator } from '@storybook/nextjs';
import { storybookTheme } from './theme';
import { ThemeProvider, Box } from '@mui/material';
import { theme as muiItaliaTheme } from './muiTheme';
import '@fontsource/titillium-web/400.css';
import '@fontsource/titillium-web/600.css';
import '@fontsource/titillium-web/700.css';
import { Global, css } from '@emotion/react';
import { nextIntlContextDecorator } from '../stories/next-intl-context.helper';

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

export const argTypes = {
  locale: {
    control: 'select',
    options: ['it', 'en'],
    description: 'Locale for internationalization',
    table: {
      category: 'Story',
      defaultValue: { summary: 'it' },
    },
    type: { name: 'string', required: false },
  },
};

export const args = {
  locale: 'it',
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

export const decorators = [withTheme, nextIntlContextDecorator];

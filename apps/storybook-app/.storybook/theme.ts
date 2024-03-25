import { create } from '@storybook/theming';

export const storybookTheme = create({
  base: 'light',
  brandTitle: 'Developer Portal',
  brandUrl: 'https://github.com/pagopa/developer-portal',

  // Palette
  colorPrimary: '#00C5CA',
  colorSecondary: '#000000',

  // Typography
  fontBase: '"Inter", sans-serif',

  // UI
  appBg: '#FFFFFF',
  appContentBg: '#FFFFFF',
  appBorderColor: '#E3E7EB',
  appBorderRadius: 0,

  // Toolbar
  barTextColor: '#333333',
  barSelectedColor: '#000000',
});

'use client';
import { ReactNode } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import { theme as muiItaliaTheme } from '@pagopa/mui-italia';
import { createTheme, ThemeProvider } from '@mui/material/styles';

export const theme = createTheme(muiItaliaTheme);

type ThemeRegistryProps = {
  children: ReactNode;
};

export default function ThemeRegistry({ children }: ThemeRegistryProps) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}

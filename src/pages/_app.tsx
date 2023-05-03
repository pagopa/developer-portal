import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { createTheme, ThemeProvider } from '@mui/material';
import { theme as muiItaliaTheme } from '@pagopa/mui-italia';

export const theme = createTheme(muiItaliaTheme, {
  palette: {
    background: {
      code: '#363C42',
    },
  },
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={theme}>
      <Component {...pageProps} />
    </ThemeProvider>
  );
}

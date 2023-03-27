import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { createTheme, ThemeProvider } from '@mui/material';
import { theme as muiItaliaTheme } from '@pagopa/mui-italia';

const theme = createTheme(muiItaliaTheme, {
  palette: {
    background: {
      code: '#363C42',
      dark: '#4D5D6D',
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

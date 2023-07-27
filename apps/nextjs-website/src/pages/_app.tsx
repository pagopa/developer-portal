import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import '@/styles/globals.css';
import { createTheme, ThemeProvider } from '@mui/material';
import type { AppProps } from 'next/app';
import { theme as muiItaliaTheme } from '@pagopa/mui-italia';

export const theme = createTheme(muiItaliaTheme);

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={theme}>
      <Component {...pageProps} />
    </ThemeProvider>
  );
}

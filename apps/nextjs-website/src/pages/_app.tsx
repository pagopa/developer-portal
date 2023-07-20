import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import '@/styles/globals.css';
import { createTheme, ThemeProvider } from '@mui/material';
import type { AppProps } from 'next/app';
import { theme as muiItaliaTheme } from '@pagopa/mui-italia';
import { useEffect } from 'react';

export const theme = createTheme(muiItaliaTheme);

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    const script = document.createElement('script');
    // eslint-disable-next-line functional/immutable-data
    script.src = 'https://cdn.cookielaw.org/scripttemplates/otSDKStub.js';
    script.setAttribute(
      'data-domain-script',
      'a8c87faf-1769-4c95-a2e5-a6fff26eadab'
    );
    document.body.appendChild(script);
  }, []);
  return (
    <ThemeProvider theme={theme}>
      <Component {...pageProps} />
    </ThemeProvider>
  );
}

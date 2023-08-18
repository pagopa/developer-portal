'use client';
import { Metadata } from 'next';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import '@/styles/globals.css';
import { createTheme, ThemeProvider } from '@mui/material';
//import { theme as muiItaliaTheme } from '@pagopa/mui-italia';

//export const theme = createTheme(muiItaliaTheme);

export default function RootLayout({
  // Layouts must accept a children prop.
  // This will be populated with nested layouts or pages
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <body>{children}</body>
    </html>
  );
}

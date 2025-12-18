'use client';
import { ReactNode, useState } from 'react';
import createCache from '@emotion/cache';
import { useServerInsertedHTML } from 'next/navigation';
import { CacheProvider } from '@emotion/react';
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider } from '@mui/material';
import type { Options } from '@emotion/cache';
import React from 'react';

declare module '@mui/material/styles' {
  interface TypographyVariants {
    sidenav: React.CSSProperties;
    'caption-semibold': React.CSSProperties;
    monospaced: React.CSSProperties;
  }

  // allow configuration using `createTheme`
  interface TypographyVariantsOptions {
    sidenav?: React.CSSProperties;
    'caption-semibold'?: React.CSSProperties;
    monospaced?: React.CSSProperties;
  }
}

// Update the Typography's variant prop options
declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    sidenav: true;
    'caption-semibold': true;
    monospaced: true;
  }
}
export const theme = createTheme({
  palette: {
    primary: {
      main: '#0066CC',
    },
  },
  typography: {
    sidenav: {
      fontFamily: '"Titillium Web", sans-serif',
      fontSize: '1rem',
      fontWeight: 600,
    },
    'caption-semibold': {
      fontFamily: '"Titillium Web", sans-serif',
      fontSize: '0.75rem',
      fontWeight: 600,
    },
    monospaced: {
      fontFamily: '"Roboto Mono", monospace',
      fontSize: '1rem',
      fontWeight: 400,
    },
  },
  components: {
    MuiTypography: {
      styleOverrides: {
        root: ({ ownerState }) => ({
          ...(ownerState.variant === 'sidenav' && {
            fontFamily: '"Titillium Web", sans-serif',
            fontSize: '1rem',
            fontWeight: 600,
          }),
        }),
      },
    },
  },
});

// This implementation is from emotion-js
// https://github.com/emotion-js/emotion/issues/2928#issuecomment-1319747902
export default function ThemeRegistry({
  options,
  children,
}: {
  options: Options;
  children: ReactNode;
}) {
  const [{ cache, flush }] = useState(() => {
    const cache = createCache(options);
    /* eslint-disable-next-line functional/immutable-data */
    cache.compat = true;
    const prevInsert = cache.insert;
    // eslint-disable-next-line functional/no-let
    let inserted: string[] = [];
    /* eslint-disable-next-line functional/immutable-data */
    cache.insert = (...args) => {
      const serialized = args[1];
      if (cache.inserted[serialized.name] === undefined) {
        /* eslint-disable-next-line functional/immutable-data */
        inserted.push(serialized.name);
      }
      return prevInsert(...args);
    };
    const flush = () => {
      const prevInserted = inserted;
      inserted = [];
      return prevInserted;
    };
    return { cache, flush };
  });

  useServerInsertedHTML(() => {
    const names = flush();
    if (names.length === 0) {
      return null;
    }
    // eslint-disable-next-line functional/no-let
    let styles = '';
    names.forEach((name) => {
      styles += cache.inserted[name];
    });
    return (
      <style
        key={cache.key}
        data-emotion={`${cache.key} ${names.join(' ')}`}
        dangerouslySetInnerHTML={{
          __html: styles,
        }}
      />
    );
  });

  return (
    <CacheProvider value={cache}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </CacheProvider>
  );
}

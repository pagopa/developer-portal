/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-this-expressions */
'use client';
import { ElementType, FC, useEffect } from 'react';
import { Box, useTheme } from '@mui/material';
import { PRODUCT_HEADER_HEIGHT, SITE_HEADER_HEIGHT } from '@/config';
import 'rapidoc';

type ApiViewerProps = {
  specURL: string;
};

const scrollOffset = SITE_HEADER_HEIGHT + PRODUCT_HEADER_HEIGHT;

const ApiViewer: FC<ApiViewerProps> = ({ specURL }) => {
  const { palette } = useTheme();

  useEffect(() => {
    // Handle initial load with hash
    if (window.location.hash) {
      window.scrollTo({ top: 0 });
    }

    // Intercept History API calls to handle navigation
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    const handleHistoryChange = () => {
      window.scrollTo({ top: 0 });
    };

    history.pushState = function (...args) {
      originalPushState.apply(this, args);
      handleHistoryChange();
    };

    history.replaceState = function (...args) {
      originalReplaceState.apply(this, args);
      handleHistoryChange();
    };

    window.addEventListener('popstate', handleHistoryChange);

    return () => {
      history.pushState = originalPushState;
      history.replaceState = originalReplaceState;
      window.removeEventListener('popstate', handleHistoryChange);
    };
  }, []);

  // Cast strict TS error for custom element
  const RapiDoc = 'rapi-doc' as unknown as ElementType;

  return (
    <Box
      sx={{
        display: 'flex',
        height: `calc(100vh - ${scrollOffset}px)`,
        width: '100%',
        overflow: 'hidden',
      }}
    >
      <RapiDoc
        allow-advanced-search='false'
        allow-authentication='false'
        allow-server-selection='false'
        allow-try='false'
        auto-scroll='false'
        bg-color={palette.background.paper}
        font-size='large'
        mono-font='Titillium Web'
        nav-bg-color={palette.grey[50]}
        nav-text-color={palette.text.primary}
        primary-color={palette.primary.main}
        regular-font='Titillium Web'
        render-style='focused'
        scroll-y-offset='0'
        show-components='true'
        show-header='false'
        show-method-in-nav-bar='as-plain-text'
        spec-url={specURL}
        text-color={palette.text.primary}
        theme={palette.mode}
      />
    </Box>
  );
};

export default ApiViewer;

'use client';
import { FC } from 'react';
import { Box, useTheme } from '@mui/material';
import 'rapidoc';

// Extend JSX to recognize the custom element <rapi-doc>
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      'rapi-doc': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      > & {
        'spec-url'?: string;
        theme?: string;
        'render-style'?: string;
        'show-header'?: string;
        'primary-color'?: string;
      };
    }
  }
}

type ApiViewerProps = {
  specURL: string;
  hideTryIt?: boolean;
};

const ApiViewer: FC<ApiViewerProps> = ({ specURL }) => {
  const { palette } = useTheme();

  // function that return current API component type
  return (
    <Box
      sx={{
        mt: 0,
        display: 'flex',
        height: '100%',
        width: '100%',
        overflow: 'hidden',
      }}
    >
      {/* @ts-ignore */}
      <rapi-doc
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
        theme='light'
      >
      {/* @ts-ignore */}
      </rapi-doc>
    </Box>
  );
};

export default ApiViewer;

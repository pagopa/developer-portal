'use client';
import { FC } from 'react';
import { Box, useTheme } from '@mui/material';
import { Product } from '@/lib/types/product';
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
  product: Product;
  hideTryIt?: boolean;
};

const ApiViewer: FC<ApiViewerProps> = ({ specURL, product }) => {
  const { palette } = useTheme();
  // function that return current API component type
  return (
    <Box
      sx={{
        mt: 2,
        display: 'flex',
        height: '100%',
        width: '100%',
        overflow: 'hidden',
      }}
    >
      <rapi-doc
        spec-url={specURL}
        theme='light'
        nav-bg-color='#EBEEF5'
        bg-color={palette.background.paper}
        text-color={palette.text.primary}
        nav-text-color={palette.text.primary}
        regular-font='Titillium Web'
        mono-font='Titillium Web'
        font-size='largest'
        allow-search='false'
        allow-advanced-search='false'
        render-style='focused'
        show-header='false'
        allow-authentication='false'
        primary-color='#3b82f6'
        scroll-y-offset='0'
        auto-scroll='false'
        allow-try='false'
        allow-server-selection='false'
        show-method-in-nav-bar='as-colored-block'
      ></rapi-doc>
    </Box>
  );
};

export default ApiViewer;

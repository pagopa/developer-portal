'use client';
import { FC, useEffect, useState } from 'react';
import { Box, SelectChangeEvent } from '@mui/material';
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
        render-style='read'
        show-header='false'
        allow-authentication='false'
        primary-color='#3b82f6'
        scroll-y-offset='0'
        auto-scroll='false'
        allow-try='false'
        allow-server-selection='false'
      ></rapi-doc>
    </Box>
  );
};

export default ApiViewer;

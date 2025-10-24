'use client';
import { FC } from 'react';
import { Box, useTheme } from '@mui/material';
import 'rapidoc';
import { Product } from 'schema-dts';

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
      ></rapi-doc>
    </Box>
  );
};

export default ApiViewer;

'use client';
import { HeadingProps } from 'gitbook-docs/markdoc/schema/heading';
import React, { ReactNode, useCallback } from 'react';
import MUILink from '@mui/material/Link';
import { Box, Typography, useTheme } from '@mui/material';
import { useFragment } from '@/components/organisms/FragmentProvider/FragmentProvider';

const Heading = ({ level, id, children }: HeadingProps<ReactNode>) => {
  const isString = typeof children === 'string';
  const { palette } = useTheme();
  const { fragment, setFragment } = useFragment();
  const isCurrentFragment = fragment === `#${id}`;

  const handleClick = useCallback(() => {
    setFragment(`#${id}`, { source: 'manual', suppressAutoForMs: 1500 });
  }, [id, setFragment]);

  return (
    <Box
      sx={{
        borderLeft: level === 2 ? 'none' : `.5px solid ${palette.grey[300]}`,
        paddingY: '6px',
        ':hover': { backgroundColor: palette.action.hover },
      }}
    >
      <MUILink
        href={`#${id}`}
        title={isString ? children : ''}
        onClick={handleClick}
        sx={{
          display: 'block',
          fontFamily: 'Titillium Web',
          textDecoration: 'none',
        }}
      >
        <Typography
          sx={{
            color: isCurrentFragment
              ? palette.primary.main
              : palette.text.secondary,
            fontSize: level === 2 ? 15 : 13,
            fontWeight: 400,
            paddingLeft: level === 2 ? '0px' : '18px',
          }}
        >
          {children}
        </Typography>
      </MUILink>
    </Box>
  );
};

export default Heading;

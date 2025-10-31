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
  const isLevel2 = level === 2;

  const handleClick = useCallback(() => {
    setFragment(`#${id}`, { source: 'manual', suppressAutoForMs: 1500 });
  }, [id, setFragment]);

  return (
    <Box
      sx={{
        borderLeft: isLevel2 ? 'none' : `.5px solid ${palette.grey[300]}`,
        marginLeft: isLevel2 ? '0px' : '9px',
        paddingLeft: '8px',
        paddingY: '5px',
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
            fontSize: isLevel2 ? 15 : 13,
            fontWeight: 400,
            marginLeft: isLevel2 ? '0px' : '8px',
          }}
        >
          {children}
        </Typography>
      </MUILink>
    </Box>
  );
};

export default Heading;

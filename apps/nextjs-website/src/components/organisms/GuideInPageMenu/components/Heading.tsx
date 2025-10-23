'use client';
import { HeadingProps } from 'gitbook-docs/markdoc/schema/heading';
import React, { ReactNode, useCallback } from 'react';
import MUILink from '@mui/material/Link';
import { Typography, useTheme } from '@mui/material';
import { useFragment } from '@/components/organisms/FragmentProvider/FragmentProvider';

const Heading = ({ level, id, children }: HeadingProps<ReactNode>) => {
  const isString = typeof children === 'string';
  const { palette } = useTheme();
  const { fragment, setFragment } = useFragment();
  const isCurrentFragment = fragment === `#${id}`;

  const handleClick = useCallback(() => {
    setFragment(`#${id}`);
  }, [id, setFragment]);

  return (
    <MUILink
      href={`#${id}`}
      title={isString ? children : ''}
      onClick={handleClick}
      sx={{
        display: 'block',
        fontFamily: 'Titillium Web',
        marginBottom: '12px',
        textDecoration: 'none',
      }}
    >
      <Typography
        sx={{
          color: isCurrentFragment
            ? palette.primary.main
            : palette.text.secondary,
          fontSize: level === 2 ? 16 : 14,
          fontWeight: isCurrentFragment ? 700 : 400,
        }}
      >
        {children}
      </Typography>
    </MUILink>
  );
};

export default Heading;

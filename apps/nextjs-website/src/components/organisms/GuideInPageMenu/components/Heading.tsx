import { HeadingProps } from 'gitbook-docs/markdoc/schema/heading';
import React, { ReactNode, useEffect, useState } from 'react';
import MUILink from '@mui/material/Link';
import { Typography, useTheme } from '@mui/material';
import { useFragment } from '@/components/organisms/FragmentProvider/FragmentProvider';

const Heading = ({ level, id, children }: HeadingProps<ReactNode>) => {
  const isString = typeof children === 'string';
  const { palette } = useTheme();
  const { fragment } = useFragment();
  const [isCurrentFragment, setIsCurrentFragment] = useState(false);

  useEffect(() => {
    setIsCurrentFragment(fragment === `#${id}`);
  }, [fragment, id]);

  return (
    <MUILink
      href={`#${id}`}
      title={isString ? children : ''}
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
          fontSize: level === 2 ? 18 : 16,
          fontWeight: isCurrentFragment ? 700 : 400,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        {children}
      </Typography>
    </MUILink>
  );
};

export default Heading;

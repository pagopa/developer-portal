import { HeadingProps } from 'gitbook-docs/markdoc/schema/heading';
import React, { ReactNode, useEffect, useState } from 'react';
import MUILink from '@mui/material/Link';
import { Typography, useTheme } from '@mui/material';
import { useHash } from '@/components/organisms/HashProvider/HashProvider';

const Heading = ({ level, id, children }: HeadingProps<ReactNode>) => {
  const isString = typeof children === 'string';
  const { palette } = useTheme();
  const { hash } = useHash();
  const [isCurrentHash, setIsCurrentHash] = useState(false);

  useEffect(() => {
    setIsCurrentHash(hash === `#${id}`);
  }, [hash, id]);

  if (level < 2 || level > 4) {
    return;
  }

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
          color: isCurrentHash ? palette.primary.main : palette.text.secondary,
          fontSize: 16,
          fontWeight: isCurrentHash ? 700 : 400,
        }}
      >
        {children}
      </Typography>
    </MUILink>
  );
};

export default Heading;

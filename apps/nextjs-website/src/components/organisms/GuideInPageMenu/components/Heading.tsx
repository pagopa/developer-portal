import { HeadingProps } from 'gitbook-docs/markdoc/schema/heading';
import { ReactNode } from 'react';
import MUILink from '@mui/material/Link';
import { removeEmojis } from '@/markdoc/helpers';
import { Typography, useTheme } from '@mui/material';

const Heading = ({ level, id, children }: HeadingProps<ReactNode>) => {
  const isString = typeof children === 'string';
  const theme = useTheme();

  if (level < 2 || level > 4) {
    return;
  }

  return (
    <MUILink
      href={`#${id}`}
      title={isString ? removeEmojis(children) : ''}
      sx={{
        display: 'block',
        fontFamily: 'Titillium Web',
        marginBottom: '12px',
        textDecoration: 'none',
      }}
    >
      <Typography
        sx={{
          color: theme.palette.text.secondary,
          fontSize: '16px',
          fontWeight: 400,
        }}
      >
        {isString ? removeEmojis(children) : children}
      </Typography>
    </MUILink>
  );
};

export default Heading;

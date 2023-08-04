import { HeadingProps } from 'gitbook-docs/markdoc/schema/heading';
import { ReactNode } from 'react';
import MUILink from '@mui/material/Link';
import { removeEmojis } from '@/markdoc/helpers';

const Heading = ({ level, id, children }: HeadingProps<ReactNode>) => {
  const isString = typeof children === 'string';

  if (level < 2 || level > 4) {
    return;
  }

  return (
    <>
      <MUILink
        href={`#${id}`}
        title={isString ? removeEmojis(children) : ''}
        sx={{
          color: '#0062C3',
          fontSize: '18px',
          fontWeight: 600,
          textDecoration: 'none',
        }}
      >
        {isString ? removeEmojis(children) : children}
      </MUILink>
      <br />
    </>
  );
};

export default Heading;

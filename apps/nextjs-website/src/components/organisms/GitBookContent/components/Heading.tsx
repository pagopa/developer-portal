import Typography from '@mui/material/Typography';
import { HeadingProps } from 'gitbook-docs/markdoc/schema/heading';
import { ReactNode } from 'react';

const asVariant = (level: number) => {
  switch (level) {
    case 1:
      return 'h1';
    case 2:
      return 'h2';
    case 3:
      return 'h4';
    case 4:
      return 'h5';
    default:
      return 'h6';
  }
};

const Heading = ({ level, id, children }: HeadingProps<ReactNode>) => (
  <Typography id={id} variant={asVariant(level)} sx={{ py: 3 }}>
    {children}
  </Typography>
);

export default Heading;

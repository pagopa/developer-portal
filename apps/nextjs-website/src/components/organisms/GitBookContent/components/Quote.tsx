import { Typography } from '@mui/material';
import { QuoteProps } from 'gitbook-docs/markdoc/schema/blockquote';
import { ReactNode } from 'react';

const Quote = ({ children }: QuoteProps<ReactNode>) => (
  <Typography
    component='blockquote'
    sx={{
      p: 1,
      borderLeftWidth: 3,
      borderLeftStyle: 'solid',
      borderLeftColor: ({ palette }) => palette.divider,
    }}
  >
    {children}
  </Typography>
);

export default Quote;

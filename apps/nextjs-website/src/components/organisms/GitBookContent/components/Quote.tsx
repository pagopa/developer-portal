import { Typography } from '@mui/material';
import { QuoteProps } from 'gitbook-docs/markdoc/schema/blockquote';
import { ReactNode } from 'react';

const Quote = ({ children }: QuoteProps<ReactNode>) => (
  <Typography
    component='blockquote'
    sx={{
      paddingY: 0,
      paddingX: 2,
      marginY: 2,
      borderLeftWidth: 4,
      borderLeftStyle: 'solid',
      borderLeftColor: ({ palette }) => palette.divider,
      '& > div.MuiTypography-body1': { margin: 0 },
    }}
  >
    {children}
  </Typography>
);

export default Quote;

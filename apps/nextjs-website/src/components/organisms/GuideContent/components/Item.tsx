import Typography from '@mui/material/Typography';
import { ItemProps } from 'gitbook-docs/markdoc/schema/item';
import { ReactNode } from 'react';

const Item = ({ children }: ItemProps<ReactNode>) => (
  <Typography component='li' variant='body1'>
    {children}
  </Typography>
);

export default Item;

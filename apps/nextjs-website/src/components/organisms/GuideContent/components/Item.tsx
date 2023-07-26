import Typography from '@mui/material/Typography';
import { ReactNode } from 'react';

type ItemProps = {
  checked?: boolean;
  children: ReactNode;
};

const Item = ({ children }: ItemProps) => (
  <Typography component='li' variant='body1'>
    {children}
  </Typography>
);

export default Item;

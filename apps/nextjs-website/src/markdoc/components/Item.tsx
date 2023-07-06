import { ReactNode } from 'react';
import Typography from '@mui/material/Typography';

type ItemProps = {
  children: ReactNode;
};

const Item = ({ children }: ItemProps) => {
  return (
    <li style={{ listStyleType: 'square', marginLeft: '32px', padding: 0 }}>
      <Typography variant={'body1'} component='span'>
        {children}
      </Typography>
    </li>
  );
};

export default Item;

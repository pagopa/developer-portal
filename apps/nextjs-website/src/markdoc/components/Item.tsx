import { ReactNode } from 'react';
import styles from './Item.module.css';
import Typography from '@mui/material/Typography';

type ItemProps = {
  children: ReactNode;
};

const Item = ({ children }: ItemProps) => {
  return (
    <li className={styles.Item}>
      <Typography variant={'body2'} component='span'>
        {children}
      </Typography>
    </li>
  );
};

export default Item;

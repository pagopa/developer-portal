import Typography from '@mui/material/Typography';
import { ReactNode } from 'react';

type StrongProps = {
  children: ReactNode;
};

const Strong = ({ children }: StrongProps) => (
  <Typography variant={'body1'} component='strong' fontWeight={700}>
    {children}
  </Typography>
);

export default Strong;

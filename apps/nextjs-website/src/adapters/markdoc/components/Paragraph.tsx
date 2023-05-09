import Typography from '@mui/material/Typography';
import { ReactNode } from 'react';

type HeadingProps = {
  children: ReactNode;
};

const Paragraph = ({ children }: HeadingProps) => (
  <Typography variant={'body2'} component='div'>
    {children}
  </Typography>
);

export default Paragraph;

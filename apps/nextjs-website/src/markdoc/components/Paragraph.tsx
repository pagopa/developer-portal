import Typography from '@mui/material/Typography';
import { ReactNode } from 'react';

type ParagraphProps = {
  children: ReactNode;
};

const Paragraph = ({ children }: ParagraphProps) => (
  <Typography variant={'body2'} component='div'>
    {children}
  </Typography>
);

export default Paragraph;

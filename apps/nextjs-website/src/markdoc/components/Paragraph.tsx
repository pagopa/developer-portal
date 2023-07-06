import Typography from '@mui/material/Typography';
import { ReactNode } from 'react';

type ParagraphProps = {
  children: ReactNode;
};

const Paragraph = ({ children }: ParagraphProps) => (
  <Typography
    variant={'body2'}
    component='div'
    sx={{ margin: '24px 0 8px 0 !important' }}
  >
    {children}
  </Typography>
);

export default Paragraph;

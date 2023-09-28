import Typography from '@mui/material/Typography';
import { ParagraphProps } from 'gitbook-docs/markdoc/schema/paragraph';
import { ReactNode } from 'react';

const Paragraph = ({ children }: ParagraphProps<ReactNode>) => (
  <Typography
    variant={'body1'}
    component='div'
    sx={{ my: 2, fontSize: '16px', fontWeight: 400, lineHeight: '24px' }}
  >
    {children}
  </Typography>
);

export default Paragraph;

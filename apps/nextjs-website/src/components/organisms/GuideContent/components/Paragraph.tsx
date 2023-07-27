import Typography from '@mui/material/Typography';
import { ParagraphProps } from 'gitbook-docs/markdoc/schema/paragraph';
import { ReactNode } from 'react';

const Paragraph = ({ children }: ParagraphProps<ReactNode>) => (
  <Typography variant={'body1'} component='div'>
    {children}
  </Typography>
);

export default Paragraph;

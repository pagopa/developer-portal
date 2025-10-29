import Typography from '@mui/material/Typography';
import { ParagraphProps } from 'gitbook-docs/markdoc/schema/paragraph';
import { ReactNode } from 'react';

const Paragraph = ({ children }: ParagraphProps<ReactNode>) => (
  <Typography
    variant={'body1'}
    component='div'
    sx={{
      marginBottom: 2,
      fontSize: '1rem',
      fontWeight: 400,
      lineHeight: '24px',
    }}
  >
    {children}
  </Typography>
);

export default Paragraph;

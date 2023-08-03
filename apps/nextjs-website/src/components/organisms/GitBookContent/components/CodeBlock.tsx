import { Typography } from '@mui/material';
import { CodeBlockProps } from 'gitbook-docs/markdoc/schema/code';
import { ReactNode } from 'react';

const CodeBlock = ({ children }: CodeBlockProps<ReactNode>) => (
  <Typography variant='monospaced' component='div'>
    {children}
  </Typography>
);

export default CodeBlock;

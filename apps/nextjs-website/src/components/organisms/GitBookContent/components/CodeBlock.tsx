import { Typography } from '@mui/material';
import { CodeBlockProps } from 'gitbook-docs/markdoc/schema/code';
import { ReactNode } from 'react';

const CodeBlock = ({ children }: CodeBlockProps<ReactNode>) => (
  <Typography
    variant='monospaced'
    component='div'
    style={{ wordBreak: 'break-word' }}
  >
    {children}
  </Typography>
);

export default CodeBlock;

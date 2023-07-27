import Alert from '@mui/material/Alert';
import { HintProps } from 'gitbook-docs/markdoc/schema/hint';
import { ReactNode } from 'react';

const Hint = ({ style, children }: HintProps<ReactNode>) => (
  <Alert severity={style === 'danger' ? 'warning' : style}>{children}</Alert>
);

export default Hint;

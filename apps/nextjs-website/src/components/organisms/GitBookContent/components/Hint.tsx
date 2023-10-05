import Alert, { AlertColor } from '@mui/material/Alert';
import { HintProps, HintStyle } from 'gitbook-docs/markdoc/schema/hint';
import { ReactNode } from 'react';

const asSeverity = (style: HintStyle): AlertColor =>
  style === 'danger' ? 'error' : style;

const Hint = ({ style, children }: HintProps<ReactNode>) => (
  <Alert severity={asSeverity(style)} variant={'outlined'}>
    {children}
  </Alert>
);

export default Hint;

import Alert, { AlertColor } from '@mui/material/Alert';
import { ReactNode } from 'react';

export type HintProps = {
  style: 'info' | 'success' | 'warning' | 'danger';
  children: ReactNode;
};

const toMuiSeverity = (style: HintProps['style']): AlertColor =>
  style === 'danger' ? 'warning' : style;

const Hint = ({ style, children }: HintProps) => (
  <Alert severity={toMuiSeverity(style)}>{children}</Alert>
);

export default Hint;

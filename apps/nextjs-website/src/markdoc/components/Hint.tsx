import Alert, { AlertColor } from '@mui/material/Alert';
import { ReactNode } from 'react';

export type HintProps = {
  style: 'info' | 'success' | 'warning' | 'danger';
  children: ReactNode;
};

const toMuiSeverity = (style: HintProps['style']): AlertColor =>
  style === 'danger' ? 'warning' : style;

const Hint = ({ style, children }: HintProps) => (
  <Alert severity={toMuiSeverity(style)} sx={{ margin: '16px 0' }}>
    {children}
  </Alert>
);

export default Hint;

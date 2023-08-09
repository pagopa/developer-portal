import React from 'react';
import { AlertTitle, SxProps, useTheme } from '@mui/material';
import Alert, { AlertColor } from '@mui/material/Alert';

export type AlertPartProps = {
  alertStyle?: SxProps;
  severity: AlertColor;
  text?: string;
  title: string;
};

const AlertPart = ({ alertStyle, severity, text, title }: AlertPartProps) => {
  const { spacing } = useTheme();

  return (
    <Alert
      severity={severity}
      sx={{ borderRadius: '4px', marginBottom: spacing(5), ...alertStyle }}
    >
      <AlertTitle>{title}</AlertTitle>
      {text}
    </Alert>
  );
};

export default AlertPart;

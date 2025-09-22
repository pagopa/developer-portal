'use client';
import React from 'react';
import { AlertTitle, SxProps, useTheme } from '@mui/material';
import Alert, { AlertColor } from '@mui/material/Alert';
import { computeId } from '@/components/molecules/PartRendererMenu/PartRendererMenu';

export type AlertPartData = {
  readonly alertStyle?: SxProps;
  readonly severity: AlertColor;
  readonly text?: string;
  readonly title?: string;
};

const AlertPart = ({ alertStyle, severity, text, title }: AlertPartData) => {
  const { spacing } = useTheme();

  return (
    <Alert
      id={computeId('alert', `${title}${text}`)}
      severity={severity}
      sx={{ borderRadius: '4px', marginBottom: spacing(5), ...alertStyle }}
      variant={'outlined'}
    >
      {title && <AlertTitle>{title}</AlertTitle>}
      {text}
    </Alert>
  );
};

export default AlertPart;

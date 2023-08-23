'use client';
import React from 'react';
import { SxProps, Theme, Typography, useTheme } from '@mui/material';
import { Variant } from '@mui/material/styles/createTypography';

export type TypographyPartProps = {
  color?: string;
  fontSize?: string;
  fontWeight?: string;
  sx?: SxProps<Theme>;
  style?: React.CSSProperties;
  variant?: Variant | 'inherit';
  text: string;
  asHtml?: boolean;
};

const TypographyPart = (props: TypographyPartProps) => {
  const { spacing } = useTheme();

  return (
    <Typography
      fontSize={props.fontSize || 'inherit'}
      variant={props.variant || 'body1'}
      fontWeight={props.fontWeight || 'inherit'}
      color={props.color || 'inherit'}
      style={props.style}
      sx={{ wordBreak: 'break-all', marginBottom: spacing(5), ...props.sx }}
    >
      {props.asHtml === true ? (
        <div dangerouslySetInnerHTML={{ __html: props.text }} />
      ) : (
        props.text
      )}
    </Typography>
  );
};

export default TypographyPart;

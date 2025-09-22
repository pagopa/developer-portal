'use client';
import React from 'react';
import { SxProps, Theme, Typography, useTheme } from '@mui/material';
import { Variant } from '@mui/material/styles/createTypography';

export type TypographyPartData = {
  readonly color?: string;
  readonly fontSize?: string;
  readonly fontWeight?: string;
  readonly sx?: SxProps<Theme>;
  readonly style?: React.CSSProperties;
  readonly variant?: Variant | 'inherit';
  readonly text: string;
  readonly asHtml?: boolean;
};

const TypographyPart = (props: TypographyPartData) => {
  const { spacing } = useTheme();

  return (
    <Typography
      component='div'
      fontSize={props.fontSize || 'inherit'}
      variant={props.variant || 'body1'}
      fontWeight={props.fontWeight || 'inherit'}
      color={props.color || 'inherit'}
      style={props.style}
      sx={{
        wordBreak: 'break-word',
        textAlign: 'justify',
        textAlignLast: 'left',
        marginBottom: spacing(5),
        ...props.sx,
      }}
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

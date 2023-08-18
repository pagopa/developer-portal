'use client';
import React from 'react';
import { Typography, useTheme } from '@mui/material';
import { TypographyProps } from '@mui/material/Typography/Typography';

export type TypographyPartProps = TypographyProps & {
  text: string;
  asHtml?: boolean;
};

const TypographyPart = (props: TypographyPartProps) => {
  const { spacing } = useTheme();

  return (
    <Typography
      {...props}
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

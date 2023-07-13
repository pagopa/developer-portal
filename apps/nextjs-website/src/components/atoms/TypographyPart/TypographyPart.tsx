import React from 'react';
import { Typography, useTheme } from '@mui/material';
import { TypographyProps } from '@mui/material/Typography/Typography';

export type TypographyPartProps = TypographyProps & { text: string };

const TypographyPart = (props: TypographyPartProps) => {
  const { spacing } = useTheme();

  return (
    <Typography
      {...(props as TypographyProps)}
      sx={{ marginBottom: spacing(5) }}
    >
      {props.text}
    </Typography>
  );
};

export default TypographyPart;

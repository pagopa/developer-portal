import React from 'react';
import { Typography } from '@mui/material';
import { TypographyProps } from '@mui/material/Typography/Typography';

export type TypographyPartProps = TypographyProps & { text: string };

const TypographyPart = (props: TypographyPartProps) => {
  return <Typography {...(props as TypographyProps)}>{props.text}</Typography>;
};

export default TypographyPart;

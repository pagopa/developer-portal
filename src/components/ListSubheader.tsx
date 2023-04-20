import { Typography } from '@mui/material';
import * as React from 'react';
import { ListSubheader as MUIListSubheader } from '@mui/material';

type Props = {
  title: string;
};

export const ListSubheader = ({ title }: Props) => (
  <MUIListSubheader
    component={Typography}
    sx={{
      color: 'text.secondary',
      textTransform: 'uppercase',
      fontSize: 14,
      bgcolor: 'inherit',
    }}
  >
    {title}
  </MUIListSubheader>
);

export default ListSubheader;

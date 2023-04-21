import { Typography } from '@mui/material';
import * as React from 'react';
import { ListItemText as MUIListItemText } from '@mui/material';
import Link from 'next/link';

type Props = {
  text: string;
  isCurrent: boolean;
  href: string;
};

export const ListItemText = ({ text, isCurrent, href }: Props) => (
  <MUIListItemText
    primary={
      <MUIListItemText
        primary={
          <Typography
            variant='sidenav'
            color={isCurrent ? 'primary.main' : 'text.primary'}
            fontSize={16}
            component={Link}
            href={href}
            sx={{
              textDecoration: 'none',
            }}
          >
            {text}
          </Typography>
        }
      />
    }
  />
);

export default ListItemText;

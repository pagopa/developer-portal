import Typography from '@mui/material/Typography';
import { ItemProps } from 'gitbook-docs/markdoc/schema/item';
import React from 'react';
import { ReactNode } from 'react';

const Item = ({ children }: ItemProps<ReactNode>) => {
  return (
    <Typography
      component='li'
      variant='body1'
      style={{
        wordBreak: 'break-word',
      }}
      sx={{
        '& div.MuiContainer-root:has(img)': {
          width: 'initial',
          marginLeft: '1rem',
        },
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'start',
        }}
      >
        {children}
      </div>
    </Typography>
  );
};

export default Item;

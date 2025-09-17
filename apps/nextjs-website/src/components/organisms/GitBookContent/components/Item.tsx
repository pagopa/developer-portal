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
        margin: '0px 0px 8px',
      }}
      sx={{
        '& div.MuiContainer-root:has(img)': {
          width: 'initial',
          marginLeft: '1rem',
        },
        '& div.list-item-container:has(img.data-size-line)': {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'start',
        },
        '.list-item-container, div.list-item-container > *': {
          fontSize: '1rem',
        },
      }}
    >
      <div className='list-item-container'>{children}</div>
    </Typography>
  );
};

export default Item;

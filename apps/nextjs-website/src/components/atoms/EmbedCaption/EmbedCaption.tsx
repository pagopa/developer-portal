import React from 'react';
import Typography from '@mui/material/Typography';

export type EmbedCaptionProps = {
  children?: React.ReactNode;
};

const EmbedCaption = ({ children }: EmbedCaptionProps) => {
  if (typeof children === 'string') {
    return (
      <Typography variant='caption' color='text.secondary'>
        {children}
      </Typography>
    );
  } else {
    return children;
  }
};

export default EmbedCaption;

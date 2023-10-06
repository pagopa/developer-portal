import React, { ReactNode } from 'react';
import Typography from '@mui/material/Typography';

export type EmbedFigmaProps = {
  url: string;
  children?: ReactNode;
};

const EmbedFigma = ({ url, children }: EmbedFigmaProps) => {
  return (
    <>
      <iframe
        height='450'
        width='100%'
        src={`https://www.figma.com/embed?embed_host=devportal&url=${url}`}
        allowFullScreen
      />
      <Typography variant='caption' color='text.secondary'>
        {children}
      </Typography>
    </>
  );
};

export default EmbedFigma;

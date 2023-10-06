import React from 'react';
import Typography from '@mui/material/Typography';

export type EmbedCodePenProps = {
  url: string;
  children?: React.ReactNode;
};

const EmbedCodePen = ({ url, children }: EmbedCodePenProps) => {
  const codePenUrl = url.replace('/pen/', '/embed/');

  return (
    <>
      <iframe
        height='500'
        style={{ width: '100%' }}
        title='CodePen Embed'
        src={codePenUrl}
        loading='lazy'
        allowFullScreen={true}
      ></iframe>
      <Typography variant='caption' color='text.secondary'>
        {children}
      </Typography>
    </>
  );
};

export default EmbedCodePen;

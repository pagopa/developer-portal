import React from 'react';

export type EmbedCodePenProps = {
  url: string;
};

const EmbedCodePen = ({ url }: EmbedCodePenProps) => {
  const codePenUrl = url.replace('/pen/', '/embed/');

  return (
    <iframe
      height='500'
      style={{ width: '100%' }}
      title='CodePen Embed'
      src={codePenUrl}
      loading='lazy'
      allowFullScreen={true}
    ></iframe>
  );
};

export default EmbedCodePen;

import React from 'react';
import EmbedCaption from '@/components/atoms/EmbedCaption/EmbedCaption';

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
      <EmbedCaption>{children}</EmbedCaption>
    </>
  );
};

export default EmbedCodePen;

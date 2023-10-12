import React, { ReactNode } from 'react';
import EmbedCaption from '@/components/atoms/EmbedCaption/EmbedCaption';

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
      <EmbedCaption>{children}</EmbedCaption>
    </>
  );
};

export default EmbedFigma;

import React from 'react';
import EmbedCaption from '@/components/atoms/EmbedCaption/EmbedCaption';

export type EmbedArcadeProps = {
  url: string;
  children?: React.ReactNode;
};

const EmbedArcade = ({ url, children }: EmbedArcadeProps) => {
  return (
    <>
      <iframe
        style={{ width: '100%', aspectRatio: '16/9', border: 'none' }}
        src={url}
        title='Arcade embed'
        allowFullScreen
      />
      <EmbedCaption>{children}</EmbedCaption>
    </>
  );
};

export default EmbedArcade;

import React from 'react';
import EmbedCaption from '@/components/atoms/EmbedCaption/EmbedCaption';
import EmbedLink from '@/components/atoms/EmbedLink/EmbedLink';

export type EmbedCodePenProps = {
  url: string;
  children?: React.ReactNode;
};

const EmbedYouTube = ({ url, children }: EmbedCodePenProps) => {
  const queryParams = new URL(url).searchParams;
  const videoId: string | null = queryParams.get('v');

  return (
    <>
      {videoId ? (
        <iframe
          style={{ width: '100%', aspectRatio: '16/9', border: 'none' }}
          src={`https://www.youtube.com/embed/${videoId}`}
          title='YouTube video player'
          allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
          allowFullScreen
        ></iframe>
      ) : (
        <EmbedLink url={url} />
      )}
      <EmbedCaption>{children}</EmbedCaption>
    </>
  );
};

export default EmbedYouTube;

import React from 'react';
import EmbedCaption from '@/components/atoms/EmbedCaption/EmbedCaption';
import EmbedLink from '@/components/atoms/EmbedLink/EmbedLink';

export type EmbedArcadeProps = {
  url: string;
  children?: React.ReactNode;
};

const getArcadeEmbedUrl = (url: string): string | null => {
  const match = url.match(
    /^https:\/\/app\.arcade\.software\/(?:share|flows)\/([A-Za-z0-9_-]+)(?:\/view)?\/?$/
  );

  const flowId = match?.[1];

  return flowId ? `https://demo.arcade.software/${flowId}?embed` : null;
};

const EmbedArcade = ({ url, children }: EmbedArcadeProps) => {
  const embedUrl = getArcadeEmbedUrl(url);

  return (
    <>
      {embedUrl ? (
        <iframe
          style={{
            width: '100%',
            aspectRatio: '16 / 9',
            border: 'none',
            display: 'block',
          }}
          src={embedUrl}
          title='Arcade embed'
          allow='fullscreen'
          allowFullScreen
          loading='lazy'
        />
      ) : (
        <EmbedLink url={url} />
      )}

      <EmbedCaption>{children}</EmbedCaption>
    </>
  );
};

export default EmbedArcade;

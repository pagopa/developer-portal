import { EmbedProps } from 'gitbook-docs/markdoc/schema/embed';
import React, { ReactNode } from 'react';
import EmbedCodePen from '@/components/molecules/EmbedCodePen/EmbedCodePen';
import EmbedFigma from '@/components/molecules/EmbedFigma/EmbedFigma';
import EmbedYouTube from '@/components/molecules/EmbedYouTube/EmbedYouTube';
import EmbedLink from '@/components/atoms/EmbedLink/EmbedLink';
import EmbedArcade from '@/components/molecules/EmbedArcade/EmbedArcade';
import { selectEmbedType } from '@/helpers/embed.helpers';

const Embed = ({ url, children }: EmbedProps<ReactNode>) => {
  const embedType = selectEmbedType(url);

  switch (embedType) {
    case 'codepen':
      return <EmbedCodePen url={url} />;
    case 'figma':
      return <EmbedFigma url={url}>{children}</EmbedFigma>;
    case 'youtube':
      return <EmbedYouTube url={url}>{children}</EmbedYouTube>;
    case 'arcade':
      return <EmbedArcade url={url}>{children}</EmbedArcade>;
    default:
      return <EmbedLink url={url} />;
  }
};

export default Embed;

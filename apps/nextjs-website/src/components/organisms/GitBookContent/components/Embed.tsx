import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CircularProgress,
} from '@mui/material';
import { EmbedProps } from 'gitbook-docs/markdoc/schema/embed';
import React, { ReactNode } from 'react';
import dynamic from 'next/dynamic';
import EmbedCodePen from '@/components/molecules/EmbedCodePen/EmbedCodePen';
import EmbedFigma from '@/components/molecules/EmbedFigma/EmbedFigma';
import EmbedYouTube from '@/components/molecules/EmbedYouTube/EmbedYouTube';
import EmbedLink from '@/components/atoms/EmbedLink/EmbedLink';

const NotSsrEmbedPageInfo = dynamic(
  () => import('@/components/atoms/EmbedPageInfo/EmbedPageInfo'),
  {
    ssr: false,
    loading: () => {
      return (
        <Card variant='outlined'>
          <CardActionArea>
            <CardContent>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 2,
                }}
              >
                <CircularProgress size={16} />
              </Box>
            </CardContent>
          </CardActionArea>
        </Card>
      );
    },
  }
);

const Embed = ({ url, children }: EmbedProps<ReactNode>) => {
  switch (true) {
    case url.includes('codepen.io'):
      return <EmbedCodePen url={url} />;
    case !!url.match(
      /https:\/\/([\w.-]+\.)?figma.com\/(file|proto)\/([0-9a-zA-Z]{22,128})/
    ):
      return <EmbedFigma url={url}>{children}</EmbedFigma>;
    case url.includes('youtube.com'):
      return <EmbedYouTube url={url}>{children}</EmbedYouTube>;
    case url.includes('checkout.pagopa.it'):
    case url.includes('docs.italia.it'):
    case url.includes('io.italia.it'):
    case url.includes('raw.githubusercontent.com'):
      return <NotSsrEmbedPageInfo url={url} />;
    default:
      return <EmbedLink url={url} />;
  }
};

export default Embed;

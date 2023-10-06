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
import { ButtonNaked } from '@/editorialComponents/Footer/components/ButtonNaked';
import Link from 'next/link';
import EmbedCodePen from '@/components/atoms/EmbedCodePen/EmbedCodePen';
import EmbedFigma from '@/components/atoms/EmbedFigma/EmbedFigma';

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
      /https:\/\/([\w.-]+\.)?figma.com\/(file|proto)\/([0-9a-zA-Z]{22,128})(?:\/.*)?$/
    ):
      return <EmbedFigma url={url}>{children}</EmbedFigma>;
    case url.includes('checkout.pagopa.it'):
    case url.includes('docs.italia.it'):
    case url.includes('io.italia.it'):
    case url.includes('raw.githubusercontent.com'):
    case url.includes('youtube.com'):
      return <NotSsrEmbedPageInfo url={url} />;
    default:
      return (
        <Card variant='outlined'>
          <CardActionArea>
            <CardContent>
              <ButtonNaked
                color='text'
                size='medium'
                href={url}
                component={Link}
              >
                {url}
              </ButtonNaked>
            </CardContent>
          </CardActionArea>
        </Card>
      );
  }
};

export default Embed;

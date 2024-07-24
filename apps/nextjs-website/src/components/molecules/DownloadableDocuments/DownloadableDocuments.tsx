'use client';
import React from 'react';
import { Box, Grid, Typography } from '@mui/material';
import Download from '@mui/icons-material/Download';
import CtaCard from '@/components/atoms/CtaCard/CtaCard';
import { useTranslations } from 'next-intl';

const getReadableFileSizeString = (fileSizeInBytes: number) => {
  // eslint-disable-next-line functional/no-let
  let i = -1;
  // eslint-disable-next-line functional/no-let
  let size = fileSizeInBytes;
  const byteUnits = [' kB', ' MB', ' GB', ' TB', 'PB', 'EB', 'ZB', 'YB'];
  // eslint-disable-next-line functional/no-loop-statements
  do {
    size /= 1024;
    i++;
  } while (size > 1024);

  return Math.max(size, 0.1).toFixed(1) + byteUnits[i];
};

export type DownloadableDocumentsProps = {
  documents: {
    title: string;
    tags?: { readonly label: string; readonly path?: string }[];
    downloadLink?: string;
    size?: number;
  }[];
};

const DownloadableDocuments = ({ documents }: DownloadableDocumentsProps) => {
  const t = useTranslations('shared');

  return (
    <Box width='100%'>
      <Typography
        color='text.secondary'
        fontSize={14}
        fontWeight={700}
        mb={4}
        textTransform='uppercase'
      >
        {t('downloadableDocuments')}
      </Typography>

      <Box pb={4} width={'100%'}>
        <Grid container spacing={3}>
          {documents.map(({ title, tags, downloadLink, size }, index) => {
            return (
              <Grid key={index} item xs={12} md={3}>
                <CtaCard
                  title={title}
                  cta={{
                    variant: 'outlined',
                    label: (
                      <>
                        <Typography
                          color='primary'
                          fontWeight={700}
                          fontSize={16}
                        >
                          {t('download')} -{' '}
                          {size && getReadableFileSizeString(size)}{' '}
                        </Typography>
                        <Download
                          color='primary'
                          sx={{ ml: 1, height: '18px', width: '18px' }}
                        />
                      </>
                    ),
                    href: downloadLink,
                  }}
                  tags={tags}
                />
              </Grid>
            );
          })}
        </Grid>
      </Box>
    </Box>
  );
};

export default DownloadableDocuments;

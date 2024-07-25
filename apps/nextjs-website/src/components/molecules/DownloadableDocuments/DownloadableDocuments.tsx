'use client';
import React from 'react';
import { Box, Grid, Typography } from '@mui/material';
import Download from '@mui/icons-material/Download';
import CtaCard from '@/components/atoms/CtaCard/CtaCard';
import { useTranslations } from 'next-intl';

const getReadableFileSizeString = (kilobytes: number) => {
  if (kilobytes <= 0) {
    return '0KB';
  }

  const units = ['KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const unitIndex = Math.ceil(Math.log(kilobytes) / Math.log(1024));
  const size = Math.ceil(kilobytes / Math.pow(1024, unitIndex));
  const formattedSize = size.toFixed(0);
  return `${formattedSize}${units[unitIndex]}`;
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
  const t = useTranslations();

  return (
    <Box width='100%'>
      <Typography
        color='text.secondary'
        fontSize={14}
        fontWeight={700}
        mb={4}
        textTransform='uppercase'
      >
        {t('shared.downloadableDocuments')}
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
                          {size
                            ? `${t(
                                'shared.download'
                              )} - ${getReadableFileSizeString(size)}`
                            : t('shared.download')}{' '}
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

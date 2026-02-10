'use client';
import { Webinar } from '@/lib/types/webinar';
import { Alert, Box, Snackbar, Typography, useTheme } from '@mui/material';
import React, { useState } from 'react';
import LinkButton from '@/components/atoms/LinkButton/LinkButton';
import EContainer from '@/editorialComponents/EContainer/EContainer';
import { snackbarAutoHideDurationMs } from '@/config';
import WebinarCard from '@/components/molecules/WebinarCard/WebinarCard';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';

export type FutureWebinarsShowcaseProps = {
  link?: { href?: string; label: string };
  title?:
    | 'dontLoseNext'
    | 'dontLoseNextPlural'
    | 'next'
    | 'our'
    | 'participateTo'
    | 'dedicatedWebinar';
  description?: 'description' | 'solutionDescription';
  webinars: Webinar[];
};

const FutureWebinarsShowcase = ({
  link,
  title = 'our',
  description = 'description',
  webinars,
}: FutureWebinarsShowcaseProps) => {
  const { locale } = useParams<{ locale: string }>();
  const theme = useTheme();
  const t = useTranslations('webinar.webinarsSection');
  const [error, setError] = useState<string | null>(null);

  return (
    <Box
      py={5}
      sx={{
        backgroundImage: 'url(/images/webinars.png)',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundPosition: 'bottom left',
        paddingY: 8,
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          backgroundColor: theme.palette.primary.main,
          opacity: 0.7,
        },
      }}
    >
      <EContainer>
        <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
          <Box mb={webinars.length ? 6 : 0}>
            <Typography variant='h4' mb={2} color={theme.palette.common.white}>
              {t(`title.${title}`, { webinars: webinars.length })}
            </Typography>
            <Typography variant='body2' color={theme.palette.common.white}>
              {t(description)}
            </Typography>
            {link && (
              <LinkButton
                disabled={true}
                href={`/${locale}${link.href}`}
                label={link.label}
                color={theme.palette.common.white}
              />
            )}
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
            {webinars.length ? (
              webinars.map((webinar, index) => (
                <WebinarCard
                  key={index}
                  webinar={webinar}
                  handleErrorMessage={(message: string) => {
                    setError(message);
                    return null;
                  }}
                  textColor={theme.palette.text.primary}
                />
              ))
            ) : (
              <Typography
                variant='body1'
                fontSize={18}
                color={theme.palette.common.white}
              >
                {t('noWebinars')}
              </Typography>
            )}
          </Box>
        </Box>
      </EContainer>
      <Snackbar
        open={!!error}
        autoHideDuration={snackbarAutoHideDurationMs}
        onClose={() => setError(null)}
      >
        <Alert severity={'error'}>{error}</Alert>
      </Snackbar>
    </Box>
  );
};

export default FutureWebinarsShowcase;

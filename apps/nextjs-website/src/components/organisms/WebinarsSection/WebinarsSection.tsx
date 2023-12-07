'use client';
import { Webinar } from '@/lib/types/webinar';
import { Alert, Box, Snackbar, Typography, useTheme } from '@mui/material';
import React, { useState } from 'react';
import LinkButton from '@/components/atoms/LinkButton/LinkButton';
import EContainer from '@/editorialComponents/EContainer/EContainer';
import { useUser } from '@/helpers/user.helper';
import { snackbarAutoHideDurationMs } from '@/config';
import dynamic from 'next/dynamic';

export type webinarsSectionProps = {
  title: string;
  description: string;
  link?: { href?: string; label: string };
  webinars: Webinar[];
};

const WebinarsSection = ({
  title,
  description,
  link,
  webinars,
}: webinarsSectionProps) => {
  const theme = useTheme();
  const [error, setError] = useState<string | null>(null);
  const { aligned: userAligned } = useUser();

  const NotSsrWebinarCard = dynamic(
    () => import('@/components/molecules/WebinarCard/WebinarCard'),
    { ssr: false }
  );

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
          backgroundColor: 'rgba(0, 115, 230, 0.7)',
        },
      }}
    >
      <EContainer>
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Box mb={6}>
            <Typography variant='h4' mb={2} color={theme.palette.common.white}>
              {title}
            </Typography>
            <Typography variant='body2' color={theme.palette.common.white}>
              {description}
            </Typography>
            {link && (
              <LinkButton
                disabled={true}
                href={link.href}
                label={link.label}
                color={theme.palette.common.white}
              />
            )}
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
            {webinars.map((webinar, index) => (
              <NotSsrWebinarCard
                key={index}
                webinar={webinar}
                userAligned={userAligned}
                handleErrorMessage={(message: string) => {
                  setError(message);
                  return null;
                }}
              />
            ))}
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

export default WebinarsSection;

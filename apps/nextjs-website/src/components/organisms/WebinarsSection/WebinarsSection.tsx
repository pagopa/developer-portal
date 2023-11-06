'use client';
import { Webinar } from '@/lib/types/webinar';
import { Box, Typography, useTheme } from '@mui/material';
import React from 'react';
import WebinarCard from '@/components/molecules/WebinarCard/WebinarCard';
import LinkButton from '@/components/atoms/LinkButton/LinkButton';
import EContainer from '@/editorialComponents/EContainer/EContainer';

export type webinarsSectionProps = {
  title: string;
  description: string;
  link?: { href?: string; label: string };
  webinars: Webinar[];
  children?: React.ReactNode;
};

const WebinarsSection = ({
  title,
  description,
  link,
  webinars,
  children,
}: webinarsSectionProps) => {
  const theme = useTheme();

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
              <WebinarCard
                key={index}
                title={webinar.title}
                description={webinar.description}
                path={webinar.path}
                speakers={webinar.speakers}
                startDateTime={webinar.startDateTime}
                endDateTime={webinar.endDateTime}
              >
                {children}
              </WebinarCard>
            ))}
          </Box>
        </Box>
      </EContainer>
    </Box>
  );
};

export default WebinarsSection;

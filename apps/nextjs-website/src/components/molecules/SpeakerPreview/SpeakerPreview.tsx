'use client';
import { Speaker } from '@/lib/types/speaker';
import { PersonOutline } from '@mui/icons-material';
import { Box, Typography, useTheme } from '@mui/material';
import Image from 'next/image';
import React from 'react';
import BlocksRendererClient from '../BlocksRendererClient/BlocksRendererClient';
import { useMediaQuery } from '@mui/material';
import { none } from 'fp-ts/lib/Option';

type SpeakerPreviewProps = {
  compactMode?: boolean;
  flexDirection?: 'column' | 'row';
  isSmallScreen?: boolean;
} & Speaker;

type SpeakerAvatarProps = SpeakerPreviewProps;

const SpeakerAvatar = ({
  avatar,
  name,
  compactMode = true,
  isSmallScreen = false,
}: SpeakerAvatarProps) => {
  const { palette } = useTheme();
  return avatar ? (
    <Image
      src={avatar.url}
      alt={avatar.alternativeText || name}
      width={0}
      height={0}
      sizes='100vw'
      style={{
        borderRadius: '100%',
        width: compactMode ? '4rem' : isSmallScreen ? '5rem' : '7.75rem',
        height: compactMode ? '4rem' : isSmallScreen ? '5rem' : '7.75rem',
      }}
    />
  ) : (
    <Box
      sx={{
        display: 'flex',
        flexShrink: 0,
        alignItems: 'center',
        justifyContent: 'center',
        borderStyle: 'solid',
        borderWidth: '1px',
        borderRadius: '100%',
        borderColor: palette.divider,
        width: compactMode ? '4rem' : '9.063rem',
        height: compactMode ? '4rem' : '9.063rem',
      }}
    >
      <PersonOutline fontSize={compactMode ? 'medium' : 'large'} />
    </Box>
  );
};

type SpeakerInfoProps = SpeakerPreviewProps;

const SpeakerInfo = ({
  compactMode = true,
  name,
  jobTitle,
  description,
  isSmallScreen = false,
}: SpeakerInfoProps) => {
  const { palette } = useTheme();
  return (
    <Box
      sx={{
        maxHeight: '5rem',
        maxWidth: '15.625rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        gap: '0.375rem',
      }}
    >
      {compactMode ? (
        <>
          <Typography fontSize={'1.125rem'} fontWeight={600}>
            {name}
          </Typography>
          <Typography fontSize={'1.125rem'} fontWeight={400}>
            {jobTitle}
          </Typography>
        </>
      ) : (
        <>
          <Typography
            fontWeight={700}
            fontSize={{ xs: '1.375rem', md: '1.5rem' }}
            lineHeight={{ xs: '1.813rem', md: '2rem' }}
          >
            {name}
          </Typography>
          <Typography
            fontSize={{ xs: '1rem', md: '1.125rem' }}
            fontWeight={400}
            color={palette.text.secondary}
          >
            {jobTitle}
          </Typography>
          {!isSmallScreen && description && (
            <Box mt={2}>
              <BlocksRendererClient content={description} />
            </Box>
          )}
        </>
      )}
    </Box>
  );
};

const SpeakerPreview = ({
  compactMode,
  flexDirection = 'column',
  ...speaker
}: SpeakerPreviewProps) => {
  const isSmallScreen = useMediaQuery('(max-width: 900px)');
  return (
    <Box
      sx={{
        width: compactMode
          ? '15.625rem'
          : isSmallScreen
          ? '19.5rem'
          : '16.563rem',
        display: 'flex',
        flexDirection: { sm: 'row', md: flexDirection },
        gap: 3,
        alignContent: 'center',
      }}
    >
      <SpeakerAvatar
        {...speaker}
        compactMode={compactMode}
        isSmallScreen={isSmallScreen}
      />
      <SpeakerInfo
        {...speaker}
        compactMode={compactMode}
        isSmallScreen={isSmallScreen}
      />
    </Box>
  );
};

export default SpeakerPreview;

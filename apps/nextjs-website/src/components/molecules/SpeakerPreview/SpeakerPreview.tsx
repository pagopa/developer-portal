'use client';
import { Speaker } from '@/lib/types/speaker';
import { PersonOutline } from '@mui/icons-material';
import { Box, Typography, useTheme } from '@mui/material';
import Image from 'next/image';
import React from 'react';
import BlocksRendererClient from '../BlocksRendererClient/BlocksRendererClient';
import { useMediaQuery } from '@mui/material';

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
        width: compactMode ? '64px' : isSmallScreen ? '80px' : '124px',
        height: compactMode ? '64px' : isSmallScreen ? '80px' : '124px',
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
        width: compactMode ? '64px' : '145px',
        height: compactMode ? '64px' : '145px',
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
}: SpeakerInfoProps) => {
  const { palette } = useTheme();
  return (
    <Box
      sx={{
        maxHeight: '80px',
        maxWidth: '250px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        gap: '6px',
      }}
    >
      {compactMode ? (
        <>
          <Typography fontSize={'18px'} fontWeight={600}>
            {name}
          </Typography>
          <Typography fontSize={'18px'} fontWeight={400}>
            {jobTitle}
          </Typography>
        </>
      ) : (
        <>
          <Typography
            fontWeight={700}
            fontSize={{ xs: '22px', md: '24px' }}
            lineHeight={{ xs: '29px', md: '32px' }}
          >
            {name}
          </Typography>
          <Typography
            fontSize={{ xs: '16px', md: '18px' }}
            fontWeight={400}
            color={palette.text.secondary}
          >
            {jobTitle}
          </Typography>
          {description != undefined && description.toString.length > 0 && (
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
        width: compactMode ? '250px' : isSmallScreen ? '312px' : '265px',
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
      <SpeakerInfo {...speaker} compactMode={compactMode} />
    </Box>
  );
};

export default SpeakerPreview;

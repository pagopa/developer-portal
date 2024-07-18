'use client';
import { Speaker } from '@/lib/types/speaker';
import { PersonOutline } from '@mui/icons-material';
import { Box, Typography, useTheme } from '@mui/material';
import Image from 'next/image';
import React from 'react';
import BlocksRendererClient from '../BlocksRendererClient/BlocksRendererClient';

type SpeakerPreviewProps = {
  compactMode?: boolean;
  flexDirection?: 'column' | 'row';
} & Speaker;

type SpeakerAvatarProps = SpeakerPreviewProps;

const SpeakerAvatar = ({
  avatar,
  name,
  compactMode = true,
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
        width: compactMode ? '64px' : '124px',
        height: compactMode ? '64px' : '124px',
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
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        gap: '6px',
      }}
    >
      {compactMode ? (
        <>
          <Typography variant='body2' fontWeight={600}>
            {name}
          </Typography>
          <Typography variant='body2'>{jobTitle}</Typography>
        </>
      ) : (
        <>
          <Typography fontWeight={700} fontSize={'24px'} lineHeight={'32px'}>
            {name}
          </Typography>
          <Typography
            fontSize={18}
            fontWeight={400}
            color={palette.text.secondary}
          >
            {jobTitle}
          </Typography>
          <Box mt={2}>
            <BlocksRendererClient content={description} />
          </Box>
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
  return (
    <Box
      sx={{
        width: compactMode ? '250px' : '265px',
        display: 'flex',
        flexDirection,
        gap: 3,
        alignContent: 'center',
      }}
    >
      <SpeakerAvatar {...speaker} compactMode={compactMode} />
      <SpeakerInfo {...speaker} compactMode={compactMode} />
    </Box>
  );
};

export default SpeakerPreview;

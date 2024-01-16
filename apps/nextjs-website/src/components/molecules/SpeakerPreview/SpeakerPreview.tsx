'use client';
import { Speaker } from '@/lib/types/speaker';
import { PersonOutline } from '@mui/icons-material';
import { Box, Typography, useTheme } from '@mui/material';
import Image from 'next/image';
import React from 'react';

type SpeakerPreviewProps = { compactMode?: boolean } & Speaker;

type SpeakerAvatarProps = SpeakerPreviewProps;

const SpeakerAvatar = ({
  imagePath,
  name,
  compactMode = true,
}: SpeakerAvatarProps) => {
  const { palette } = useTheme();
  return imagePath ? (
    <Image
      src={imagePath}
      alt={name}
      width={0}
      height={0}
      sizes='100vw'
      style={{
        borderRadius: '100%',
        width: compactMode ? '64px' : '145px',
        height: 'auto',
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
          <Typography variant='h5' fontWeight={700}>
            {name}
          </Typography>
          <Typography
            fontSize={18}
            fontWeight={400}
            color={palette.text.secondary}
          >
            {jobTitle}
          </Typography>
          <Typography variant='body2' mt={2}>
            {description}
          </Typography>
        </>
      )}
    </Box>
  );
};

const SpeakerPreview = ({ compactMode, ...speaker }: SpeakerPreviewProps) => {
  const flexDirection = compactMode ? 'row' : { xs: 'column', md: 'row' };

  return (
    <Box
      sx={{
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

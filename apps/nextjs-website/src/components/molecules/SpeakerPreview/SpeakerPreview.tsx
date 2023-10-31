'use client';
import { Speaker } from '@/lib/types/speaker';
import { Box, Typography, useTheme } from '@mui/material';
import Image from 'next/image';
import React from 'react';

type SpeakerPreviewProps = { compactMode?: boolean } & Speaker;

const SpeakerPreview = ({
  name,
  jobTitle,
  description,
  imagePath,
  compactMode = true,
}: SpeakerPreviewProps) => {
  const { palette } = useTheme();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        gap: 3,
        alignContent: 'center',
      }}
    >
      {imagePath && (
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
      )}
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
    </Box>
  );
};

export default SpeakerPreview;

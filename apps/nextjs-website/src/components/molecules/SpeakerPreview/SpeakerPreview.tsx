import { Speaker } from '@/lib/types/speaker';
import { Box, Typography } from '@mui/material';
import Image from 'next/image';
import React from 'react';

type SpeakerPreviewProps = Speaker;

const SpeakerPreview = ({
  name,
  jobTitle,
  imagePath,
}: SpeakerPreviewProps) => {
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
            width: '64px',
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
        <Typography variant='body2' fontWeight={600}>
          {name}
        </Typography>
        <Typography variant='body2'>{jobTitle}</Typography>
      </Box>
    </Box>
  );
};

export default SpeakerPreview;

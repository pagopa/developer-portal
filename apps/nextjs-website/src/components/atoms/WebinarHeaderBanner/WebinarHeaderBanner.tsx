'use client';
import { Button, Typography, Box, useTheme, IconButton } from '@mui/material';
import { FC, useState } from 'react';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import CloseIcon from '@mui/icons-material/Close';
import EastIcon from '@mui/icons-material/East';
import { useRouter } from 'next/navigation';

export type WebinarHeaderBannerProps = {
  readonly slug: string;
};

const WebinarHeaderBanner: FC<WebinarHeaderBannerProps> = ({ slug }) => {
  const [visible, setVisible] = useState(true);
  const router = useRouter();

  const { palette } = useTheme();
  console.log(palette);

  if (!visible) return null;

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        background: palette.text.primary,
        padding: '10px 10rem',
      }}
    >
      <Box sx={{ display: 'flex' }}>
        <VideoLibraryIcon sx={{ color: 'white' }} />
        <Typography sx={{ color: 'white', marginLeft: '10px' }}>
          Comunicazioni a valore legale. Ti aspettiamo al webinar!
        </Typography>
        <Button
          variant='text'
          endIcon={<EastIcon sx={{ height: 30 }} />}
          style={{ color: 'white', padding: 0, height: 28, marginLeft: '16px' }}
          onClick={() => {
            // eslint-disable-next-line functional/immutable-data
            router.push('/webinars/' + slug);
          }}
        >
          Scopri
        </Button>
      </Box>
      <CloseIcon
        sx={{ color: 'white' }}
        onClick={() => {
          setVisible(false);
        }}
      ></CloseIcon>
    </Box>
  );
};

export default WebinarHeaderBanner;

'use client';
import { Button, Typography, Box, useTheme, IconButton } from '@mui/material';
import { FC, useState } from 'react';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import CloseIcon from '@mui/icons-material/Close';
import EastIcon from '@mui/icons-material/East';
import { useRouter } from 'next/navigation';
import { translations } from '@/_contents/translations';

export type WebinarHeaderBannerProps = {
  readonly slug: string;
  readonly text: string;
  readonly endDateTime: Date;
};

const WebinarHeaderBanner: FC<WebinarHeaderBannerProps> = ({ slug, text }) => {
  const [visible, setVisible] = useState(!window.localStorage.getItem('slug') || new Date(window.localStorage.getItem('slug') || new Date().toISOString()) < new Date());
  const router = useRouter();

  const { palette } = useTheme();

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
          {text}
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
          {translations.homepage.webinarBannerButtonContent}
        </Button>
      </Box>
      <IconButton
        onClick={() => {
          setVisible(false);
          window.localStorage.setItem(slug, 'true');
        }}
      >
        <CloseIcon sx={{ color: 'white' }}></CloseIcon>
      </IconButton>
    </Box>
  );
};

export default WebinarHeaderBanner;

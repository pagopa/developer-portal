'use client';
import {
  Typography,
  Box,
  useTheme,
  IconButton,
  Link as MuiLink,
} from '@mui/material';
import { FC, useState } from 'react';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import CloseIcon from '@mui/icons-material/Close';
import EastIcon from '@mui/icons-material/East';
import { translations } from '@/_contents/translations';
import Link from 'next/link';

export type WebinarHeaderBannerProps = {
  readonly slug: string;
  readonly text: string;
  readonly endDateTime: Date;
};

const WebinarHeaderBanner: FC<WebinarHeaderBannerProps> = ({
  slug,
  text,
  endDateTime,
}) => {
  const [visible, setVisible] = useState(
    !window?.localStorage.getItem(slug) ||
      new Date(window?.localStorage.getItem(slug) || new Date().toISOString()) <
        new Date()
  );

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
        padding: { xs: '10px 1rem', lg: '10px 10rem' },
      }}
    >
      <Box sx={{ display: 'flex' }}>
        <VideoLibraryIcon sx={{ color: 'white' }} />
        <Typography
          sx={{
            color: 'white',
            marginLeft: '10px',
            WebkitLineClamp: '1',
            display: '-webkit-box',
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {text}
        </Typography>
        <MuiLink
          underline={'none'}
          component={Link}
          sx={{
            display: 'flex',
            color: 'white',
            fontWeight: 600,
            height: 28,
            marginLeft: '16px',
          }}
          href={'/webinars/' + slug}
        >
          {translations.homepage.webinarBannerButtonContent}
          <EastIcon sx={{ height: 30, ml: 1 }} />
        </MuiLink>
      </Box>
      <IconButton
        onClick={() => {
          setVisible(false);
          window?.localStorage.setItem(slug, endDateTime.toISOString());
        }}
      >
        <CloseIcon sx={{ color: 'white' }}></CloseIcon>
      </IconButton>
    </Box>
  );
};

export default WebinarHeaderBanner;

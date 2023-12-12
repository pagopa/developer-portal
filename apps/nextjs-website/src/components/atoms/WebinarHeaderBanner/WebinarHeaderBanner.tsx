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
import { Webinar } from '@/lib/types/webinar';

export type WebinarHeaderBannerProps = {
  webinars: readonly Webinar[];
};

const WebinarHeaderBanner: FC<WebinarHeaderBannerProps> = ({ webinars }) => {
  const nextWebinars = webinars.filter(
    ({ endDateTime }) =>
      endDateTime && new Date(endDateTime).getTime() > new Date().getTime()
  );
  const webinar = nextWebinars.find((webinar) => !!webinar);

  const slug = webinar?.slug;
  const text = webinar?.title;
  const endDateTime = webinar?.endDateTime;

  const [visible, setVisible] = useState(
    !window?.localStorage.getItem(slug || '') ||
      new Date(
        window?.localStorage.getItem(slug || '') || new Date().toISOString()
      ) < new Date()
  );

  const { palette } = useTheme();

  if (!webinar) return null;
  if (!endDateTime) return null;
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
          window?.localStorage.setItem(slug || '', endDateTime);
        }}
      >
        <CloseIcon sx={{ color: 'white' }}></CloseIcon>
      </IconButton>
    </Box>
  );
};

export default WebinarHeaderBanner;

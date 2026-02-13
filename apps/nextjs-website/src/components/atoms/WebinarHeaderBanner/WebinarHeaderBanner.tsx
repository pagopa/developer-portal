'use client';
import {
  Typography,
  Box,
  useTheme,
  IconButton,
  Link as MuiLink,
} from '@mui/material';
import { FC, useState, useEffect } from 'react';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import CloseIcon from '@mui/icons-material/Close';
import EastIcon from '@mui/icons-material/East';
import Link from 'next/link';
import { Webinar } from '@/lib/types/webinar';
import { useTranslations } from 'next-intl';
import { sortBy } from 'lodash';

export type WebinarHeaderBannerProps = {
  locale: string;
  webinars: readonly Webinar[];
};

const WebinarHeaderBanner: FC<WebinarHeaderBannerProps> = ({
  locale,
  webinars,
}) => {
  const sortedWebinars = sortBy(webinars, (webinar) =>
    new Date(webinar.startDateTime ?? 0).getTime()
  );

  const webinar = sortedWebinars
    .filter((w) => w.isVisibleInList)
    .find(
      ({ endDateTime }: Webinar) =>
        endDateTime && new Date(endDateTime).getTime() > new Date().getTime()
    );
  const { slug, title: text, endDateTime } = webinar || {};
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (!slug) return;
    const storedDateTime = window.localStorage.getItem(slug);
    const shouldShow = !storedDateTime || new Date(storedDateTime) < new Date();
    setVisible(shouldShow);
  }, [slug]);

  const { palette } = useTheme();
  const t = useTranslations('homepage');

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
        <VideoLibraryIcon sx={{ color: palette.common.white }} />
        <Typography
          sx={{
            color: palette.common.white,
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
            color: palette.common.white,
            fontWeight: 600,
            height: 28,
            marginLeft: '16px',
          }}
          href={`/${locale}/webinars/${slug}`}
        >
          {t('webinarBannerButtonContent')}
          <EastIcon sx={{ height: 30, ml: 1 }} />
        </MuiLink>
      </Box>
      <IconButton
        onClick={() => {
          setVisible(false);
          if (slug) {
            window?.localStorage.setItem(slug, endDateTime);
          }
        }}
      >
        <CloseIcon sx={{ color: palette.common.white }}></CloseIcon>
      </IconButton>
    </Box>
  );
};

export default WebinarHeaderBanner;

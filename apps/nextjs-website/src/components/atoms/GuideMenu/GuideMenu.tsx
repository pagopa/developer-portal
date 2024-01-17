'use client';
import React, { Fragment, useCallback, useEffect, useState } from 'react';
import Typography from '@mui/material/Typography';
import { usePathname } from 'next/navigation';
import ArrowDropDownOutlinedIcon from '@mui/icons-material/ArrowDropDownOutlined';
import CloseIcon from '@mui/icons-material/Close';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Theme,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { SITE_HEADER_HEIGHT } from '@/components/molecules/SiteHeader/SiteHeader';
import { useScrollUp } from '../ProductHeader/useScrollUp';
import GuideMenuItems, { type GuideMenuItemsProps } from './Menu';
import { useTranslations } from 'next-intl';

type GuideMenuProps = GuideMenuItemsProps;

export const PRODUCT_HEADER_HEIGHT = 75;

const GuideMenu = (menuProps: GuideMenuProps) => {
  const [open, setOpen] = useState(false);
  const { palette } = useTheme();
  const t = useTranslations('productGuidePage');
  const isDesktop = useMediaQuery((theme: Theme) => theme.breakpoints.up('lg'));
  const scrollUp = useScrollUp();
  const currentPath = usePathname();

  const segments = currentPath.split('/');
  const expanded = segments.map((_, i) => segments.slice(0, i + 1).join('/'));

  const top = scrollUp
    ? SITE_HEADER_HEIGHT + PRODUCT_HEADER_HEIGHT
    : PRODUCT_HEADER_HEIGHT;

  const height = `calc(100vh - ${top}px)`;

  const handleClick = useCallback(() => {
    setOpen((prev) => !prev);
  }, []);

  useEffect(() => {
    if (isDesktop) {
      setOpen(false);
    }
  }, [isDesktop]);

  const items = (
    <GuideMenuItems
      {...menuProps}
      currentPath={currentPath}
      expanded={expanded}
    />
  );

  return (
    <Fragment>
      <Stack
        sx={{
          backgroundColor: palette.grey[50],
          flexShrink: 0,
          position: 'sticky',
          top,
          height: { lg: height },
          overflowY: 'auto',
          transition: 'all 0.5s linear',
          scrollbarWidth: 'thin',
          width: { lg: '347px' },
          zIndex: 1,
        }}
      >
        <Stack
          sx={{
            padding: { lg: '80px 0' },
            flexGrow: { lg: 0 },
            flexShrink: { lg: 0 },
          }}
        >
          <Stack
            direction='row'
            alignItems='center'
            justifyContent='flex-start'
            onClick={isDesktop ? undefined : handleClick}
            sx={{
              padding: '12px 24px',
              cursor: 'pointer',
              display: { lg: 'none' },
            }}
          >
            <Typography
              variant='h6'
              sx={{
                fontSize: '16px!important',
                verticalAlign: 'middle',
                color: palette.primary.main,
              }}
            >
              {t('tableOfContents')}
            </Typography>
            <IconButton
              size='small'
              sx={{ display: { lg: 'none' }, color: palette.primary.main }}
            >
              <ArrowDropDownOutlinedIcon sx={{ width: 24, height: 24 }} />
            </IconButton>
          </Stack>
          {isDesktop && items}
        </Stack>
      </Stack>
      {!isDesktop && (
        <Dialog open={open} onClose={handleClick} fullScreen>
          <DialogTitle
            component={Stack}
            direction='row'
            alignItems='center'
            justifyContent='flex-start'
            sx={{
              padding: '12px 24px',
            }}
          >
            <Typography
              variant='h6'
              sx={{
                flexGrow: 1,
                flexShrink: 0,
                fontSize: '16px!important',
                verticalAlign: 'middle',
                color: palette.primary.main,
              }}
            >
              {t('tableOfContents')}
            </Typography>
            <IconButton
              aria-label='close'
              onClick={handleClick}
              sx={{
                color: palette.primary.main,
              }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent sx={{ px: 0 }}>{items}</DialogContent>
        </Dialog>
      )}
    </Fragment>
  );
};

export default GuideMenu;

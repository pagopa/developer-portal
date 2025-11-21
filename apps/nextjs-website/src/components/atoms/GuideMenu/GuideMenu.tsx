'use client';
import React, {
  Fragment,
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
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
import { useScrollUp } from '../ProductHeader/useScrollUp';
import GuideMenuItems, { type GuideMenuItemsProps } from './Menu';
import { useTranslations } from 'next-intl';
import { PRODUCT_HEADER_HEIGHT, SITE_HEADER_HEIGHT } from '@/config';

type GuideMenuProps = GuideMenuItemsProps & {
  distanceFromTop?: number;
  hasHeader: boolean;
  hasProductHeader?: boolean;
};

const GuideMenu = (menuProps: GuideMenuProps) => {
  const [open, setOpen] = useState(false);
  const menuContainerRef = useRef<HTMLDivElement>(null);
  const { palette } = useTheme();
  const t = useTranslations();
  const isDesktop = useMediaQuery((theme: Theme) => theme.breakpoints.up('lg'));
  const scrollUp = useScrollUp();
  const currentPath = usePathname();

  const segments = currentPath.split('/');
  const expanded = segments.map((_, i) => segments.slice(0, i + 1).join('/'));

  const topOffsetXs =
    scrollUp || !menuProps.hasProductHeader ? SITE_HEADER_HEIGHT : 0;

  const productHeaderHeight = menuProps.hasProductHeader
    ? PRODUCT_HEADER_HEIGHT
    : 0;

  const height = `calc(100vh - ${SITE_HEADER_HEIGHT + productHeaderHeight}px)`;

  const topStyle = menuProps.hasHeader
    ? {
        xs: topOffsetXs + 62,
        sm: topOffsetXs + 75,
        md: SITE_HEADER_HEIGHT + productHeaderHeight,
      }
    : {
        xs: topOffsetXs,
        sm: topOffsetXs,
        md: topOffsetXs,
      };

  const handleClick = useCallback(() => {
    setOpen((prev) => !prev);
  }, []);

  const scrollToActiveItem = useCallback(() => {
    if (!menuContainerRef.current) return;

    const activeItem = menuContainerRef.current.querySelector(
      '[data-active="true"]'
    );
    if (activeItem) {
      const container = menuContainerRef.current;
      const containerRect = container.getBoundingClientRect();
      const itemRect = activeItem.getBoundingClientRect();

      // Calculate the position of the item relative to the container
      const itemTop = itemRect.top - containerRect.top + container.scrollTop;
      const itemBottom = itemTop + itemRect.height;

      // Calculate the visible area of the container
      const containerHeight = container.clientHeight;
      const scrollTop = container.scrollTop;
      const scrollBottom = scrollTop + containerHeight;

      // Check if item is outside the visible area
      if (itemTop < scrollTop || itemBottom > scrollBottom) {
        // Center the item in the container
        const targetScrollTop =
          itemTop - containerHeight / 2 + itemRect.height / 2;

        container.scrollTo({
          top: Math.max(0, targetScrollTop),
        });
      }
    }
  }, []);

  useEffect(() => {
    if (isDesktop) {
      setOpen(false);
    }
  }, [isDesktop]);

  useEffect(() => {
    const timer = setTimeout(scrollToActiveItem, 100);
    return () => clearTimeout(timer);
  }, [currentPath, scrollToActiveItem]);

  const items = (
    <GuideMenuItems
      {...menuProps}
      currentPath={currentPath}
      expanded={expanded}
      containerRef={menuContainerRef}
    />
  );

  return (
    <Fragment>
      <Stack
        ref={menuContainerRef}
        sx={{
          backgroundColor: palette.grey[50],
          flexShrink: 0,
          position: 'sticky',
          top: topStyle,
          height: { lg: height },
          overflowY: 'auto',
          transition: 'all 0.5s linear',
          scrollbarWidth: 'thin',
          width: { lg: '347px' },
          zIndex: 51,
        }}
      >
        <Stack
          sx={{
            padding: { lg: '28px 0' },
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
              {t('productGuidePage.tableOfContents')}
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
              {t('productGuidePage.tableOfContents')}
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

export default memo(GuideMenu);

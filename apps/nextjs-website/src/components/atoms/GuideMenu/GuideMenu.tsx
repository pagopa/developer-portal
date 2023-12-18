'use client';
import React, { useCallback, useState } from 'react';
import Typography from '@mui/material/Typography';
import { usePathname } from 'next/navigation';
import ArrowDropDownOutlinedIcon from '@mui/icons-material/ArrowDropDownOutlined';
import {
  Collapse,
  IconButton,
  Stack,
  Theme,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { SITE_HEADER_HEIGHT } from '@/components/molecules/SiteHeader/SiteHeader';
import { useScrollUp } from '../ProductHeader/useScrollUp';
import GuideMenuItems, { type GuideMenuItemsProps } from './Menu';

type GuideMenuProps = GuideMenuItemsProps & {
  guideName: string;
};

export const PRODUCT_HEADER_HEIGHT = {
  xs: 60,
  md: 90,
  lg: 75,
};

const GuideMenu = ({ guideName, ...menuProps }: GuideMenuProps) => {
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery((theme: Theme) => theme.breakpoints.up('lg'));
  const { palette } = useTheme();
  const scrollUp = useScrollUp();
  const currentPath = usePathname();
  const segments = currentPath.split('/');
  const expanded = segments.map((_, i) => segments.slice(0, i + 1).join('/'));
  // const top = scrollUp
  //   ? SITE_HEADER_HEIGHT + PRODUCT_HEADER_HEIGHT
  //   : PRODUCT_HEADER_HEIGHT;

  const getTopValue = (breakpoint: 'xs' | 'md' | 'lg') => {
    const top = scrollUp
      ? SITE_HEADER_HEIGHT + PRODUCT_HEADER_HEIGHT[breakpoint]
      : PRODUCT_HEADER_HEIGHT[breakpoint];
    return top;
  };

  const height = `calc(100vh - ${getTopValue('lg')}px)`;

  const handleClick = useCallback(() => {
    setOpen((prev) => !prev);
  }, []);

  const items = (
    <GuideMenuItems
      {...menuProps}
      currentPath={currentPath}
      expanded={expanded}
    />
  );

  return (
    <Stack
      sx={{
        backgroundColor: palette.grey[50],
        flexShrink: 0,
        position: 'sticky',
        top: {
          xs: getTopValue('xs'),
          md: getTopValue('md'),
          lg: getTopValue('lg'),
        },
        height: { xs: 'auto', lg: height },
        maxHeight: { xs: 350, lg: height },
        overflowY: 'auto',
        transition: 'all 0.5s linear',
        scrollbarWidth: 'thin',
        width: { lg: '347px' },
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
          sx={{ padding: '16px 24px', cursor: 'pointer' }}
        >
          <Typography
            variant='h6'
            sx={{
              verticalAlign: 'middle',
            }}
          >
            {guideName}
          </Typography>
          <IconButton size='small' sx={{ display: { lg: 'none' } }}>
            <ArrowDropDownOutlinedIcon sx={{ width: 24, height: 24 }} />
          </IconButton>
        </Stack>
        {isDesktop ? (
          items
        ) : (
          <Collapse appear={open} in={open}>
            {items}
          </Collapse>
        )}
      </Stack>
    </Stack>
  );
};

export default GuideMenu;

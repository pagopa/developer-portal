'use client';
import HomepageButton from '@/components/molecules/HomepageButton/HomepageButton';
import { Product } from '@/lib/types/product';
import { Box, Divider, Stack, useTheme } from '@mui/material';
import { useTranslations } from 'next-intl';
import React, { ForwardedRef, forwardRef } from 'react';
import MobileSiteHeader from '../MobileSiteHeader/MobileSiteHeader';
import DesktopSiteHeader from '@/components/molecules/DesktopSiteHeader/DesktopSiteHeader';

// Used in ProductHeader.tsx to manage scroll-up animation
export const SITE_HEADER_HEIGHT = 48;

export type SiteHeaderProps = {
  products: Product[];
};

const SiteHeader = (
  { products }: SiteHeaderProps,
  ref: ForwardedRef<HTMLDivElement>
) => {
  const { palette } = useTheme();
  const t = useTranslations('devPortal');

  const dropdownItems = products.map((product) => ({
    href: product.subpaths.overview.path,
    label: product.name,
  }));

  return (
    <Box
      sx={{
        position: 'sticky',
        top: 0,
        height: SITE_HEADER_HEIGHT,
        zIndex: 100,
      }}
    >
      <Stack
        ref={ref}
        sx={{
          paddingTop: '7px',
          paddingBottom: '6px',
          px: 3,
          backgroundColor: palette.common.white,
          minHeight: SITE_HEADER_HEIGHT,
          borderBottomWidth: 1,
          borderBottomStyle: 'solid',
          borderBottomColor: palette.divider,
        }}
        spacing={{ xs: 0, sm: 2 }}
        direction='row'
        justifyContent={{ sm: 'space-between', md: 'start' }}
        alignItems='center'
      >
        <HomepageButton title={t('title')} boldTitle={t('company')} />
        <MobileSiteHeader products={products} />
        <DesktopSiteHeader products={products} />
      </Stack>
      <Divider />
    </Box>
  );
};

export default forwardRef(SiteHeader);

'use client';
import HomepageButton from '@/components/molecules/HomepageButton/HomepageButton';
import { Product } from '@/lib/types/product';
import { Box, Divider, Stack, useTheme } from '@mui/material';
import { useTranslations } from 'next-intl';
import React, { ForwardedRef, forwardRef, useMemo } from 'react';
import MobileSiteHeader from '../MobileSiteHeader/MobileSiteHeader';
import DesktopSiteHeader from '@/components/molecules/DesktopSiteHeader/DesktopSiteHeader';
import { SITE_HEADER_HEIGHT } from '@/config';

export type SiteHeaderProps = {
  currentLocale: string;
  products: Product[];
  isSolutionListPagePresent: boolean;
  isWebinarPagePresent: boolean;
};

const SiteHeader = (
  {
    currentLocale,
    products,
    isSolutionListPagePresent,
    isWebinarPagePresent,
  }: SiteHeaderProps,
  ref: ForwardedRef<HTMLDivElement>
) => {
  const { palette } = useTheme();
  const t = useTranslations('devPortal');

  const productsWithOverview = useMemo(
    () => products.filter((product: Product) => product.hasOverviewPage),
    [products]
  );

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        height: SITE_HEADER_HEIGHT,
        zIndex: 100,
        width: '100vw',
      }}
    >
      <Stack
        ref={ref}
        sx={{
          px: 3,
          backgroundColor: palette.common.white,
          minHeight: SITE_HEADER_HEIGHT,
        }}
        spacing={{ xs: 0, sm: 2 }}
        direction='row'
        justifyContent={{ sm: 'space-between', md: 'start' }}
        alignItems='center'
      >
        <HomepageButton
          href={`/${currentLocale}`}
          title={t('title')}
          boldTitle={t('company')}
        />
        <MobileSiteHeader
          currentLocale={currentLocale}
          products={productsWithOverview}
          isSolutionListPagePresent={isSolutionListPagePresent}
          isWebinarPagePresent={isWebinarPagePresent}
        />
        <DesktopSiteHeader
          currentLocale={currentLocale}
          products={productsWithOverview}
          isSolutionListPagePresent={isSolutionListPagePresent}
          isWebinarPagePresent={isWebinarPagePresent}
        />
      </Stack>
      <Divider />
    </Box>
  );
};

export default forwardRef(SiteHeader);

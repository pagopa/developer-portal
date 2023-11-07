'use client';
import { translations } from '@/_contents/translations';
import Dropdown from '@/components/atoms/Dropdown/Dropdown';
import UserInfo from '@/components/atoms/UserInfo/UserInfo';
import HomepageButton from '@/components/molecules/HomepageButton/HomepageButton';
import { Product } from '@/lib/types/product';
import { Box, Divider, Stack, useTheme } from '@mui/material';
import { ForwardedRef, forwardRef } from 'react';

// Used in ProductHeader.tsx to manage scroll-up animation
export const SITE_HEADER_HEIGHT = 60;

type SiteHeaderProps = {
  products: Product[];
};

const SiteHeader = (
  { products }: SiteHeaderProps,
  ref: ForwardedRef<HTMLDivElement>
) => {
  const { header } = translations;
  const { palette } = useTheme();

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
          py: 2,
          px: 3,
          backgroundColor: palette.common.white,
        }}
        spacing={2}
        direction='row'
        justifyContent={{ sm: 'space-between', md: 'start' }}
        alignItems='center'
      >
        <HomepageButton title={header.title} boldTitle={header.boldTitle} />
        <Dropdown
          label={header.products}
          items={products.map((product) => ({
            href: product.subpaths.overview.path,
            label: product.name,
          }))}
        />
        <UserInfo />
      </Stack>
      <Divider />
    </Box>
  );
};

export default forwardRef(SiteHeader);

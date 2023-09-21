'use client';
import React from 'react';
import { translations } from '@/_contents/translations';
import Dropdown from '@/components/atoms/Dropdown/Dropdown';
import { Product } from '@/lib/types/product';
import { Divider, Stack, useTheme } from '@mui/material';
import HomepageButton from '@/components/molecules/HomepageButton/HomepageButton';

type SiteHeaderProps = {
  products: Product[];
};

const SiteHeader = ({ products }: SiteHeaderProps) => {
  const { header } = translations;
  const { palette } = useTheme();
  return (
    <>
      <Stack
        sx={{ py: 2, px: 3, backgroundColor: palette.common.white }}
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
      </Stack>
      <Divider />
    </>
  );
};

export default SiteHeader;

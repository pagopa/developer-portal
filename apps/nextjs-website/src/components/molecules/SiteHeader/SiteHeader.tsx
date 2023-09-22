import React, { ForwardedRef, forwardRef } from 'react';
import { translations } from '@/_contents/translations';
import Dropdown from '@/components/atoms/Dropdown/Dropdown';
import { Product } from '@/lib/types/product';
import { Divider, Stack } from '@mui/material';
import HomepageButton from '@/components/molecules/HomepageButton/HomepageButton';

type SiteHeaderProps = {
  products: Product[];
};

const SiteHeader = (
  { products }: SiteHeaderProps,
  ref: ForwardedRef<HTMLDivElement>
) => {
  const { header } = translations;
  return (
    <>
      <Stack
        ref={ref}
        sx={{ p: 2 }}
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

export default forwardRef(SiteHeader);

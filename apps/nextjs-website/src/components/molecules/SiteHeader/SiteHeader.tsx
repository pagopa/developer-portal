import React from 'react';
import { translations } from '@/_contents/translations';
import Dropdown from '@/components/atoms/Dropdown/Dropdown';
import HomepageButton from '@/components/atoms/HomepageButton/HomepageButton';
import { Product } from '@/lib/types/product';
import { Divider, Stack } from '@mui/material';

type SiteHeaderProps = {
  products: Product[];
};

const SiteHeader = ({ products }: SiteHeaderProps) => {
  const { header } = translations;
  return (
    <>
      <Stack
        sx={{ m: 2 }}
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

import React from 'react';
import { translations } from '@/_contents/translations';
import Dropdown from '@/components/atoms/Dropdown/Dropdown';
import { Product } from '@/lib/types/product';
import { Box, Divider, Stack } from '@mui/material';
import HomepageButton from '@/components/molecules/HomepageButton/HomepageButton';

type SiteHeaderProps = {
  products: Product[];
};

const SiteHeader = ({ products }: SiteHeaderProps) => {
  const { header } = translations;
  return (
    <>
      <Box paddingX={{ xs: 1, sm: 3 }}>
        <Stack
          sx={{ my: 2 }}
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
      </Box>
      <Divider />
    </>
  );
};

export default SiteHeader;

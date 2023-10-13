'use client';
import { productToMenuItems } from '@/helpers/productHeader.helper';
import { Product } from '@/lib/types/product';
import { Box, useTheme } from '@mui/material';
import { Header } from '@/editorialComponents/Header';
import React, { FC } from 'react';
import { useScrollUp } from '@/components/atoms/ProductHeader/useScrollUp';

type ProductHeaderProps = {
  product: Product;
  path: string;
};

// Top should always be equal to SiteHeader.tsx height
const SITE_HEADER_HEIGHT = 60;

const ProductHeader: FC<ProductHeaderProps> = ({ product, path }) => {
  const { palette } = useTheme();
  const scrollUp = useScrollUp();

  const themeVariant = palette.mode;
  return (
    <Box
      sx={{
        position: 'sticky',
        top: scrollUp ? SITE_HEADER_HEIGHT : 0,
        zIndex: 101,
        transition: 'all 0.5s linear',
      }}
    >
      <Header
        menu={[...productToMenuItems(product, path, themeVariant)]}
        product={{
          href: product.subpaths.overview.path,
          name: product.name,
        }}
        theme={themeVariant}
      />
    </Box>
  );
};

export default ProductHeader;

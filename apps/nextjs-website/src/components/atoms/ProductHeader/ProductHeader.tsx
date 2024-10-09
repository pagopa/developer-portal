'use client';
import { productToMenuItems } from '@/helpers/productHeader.helper';
import { Product } from '@/lib/types/product';
import { Box, useTheme } from '@mui/material';
import { Header } from '@/editorialComponents/Header';
import React, { FC } from 'react';
import { useScrollUp } from '@/components/atoms/ProductHeader/useScrollUp';
import { SITE_HEADER_HEIGHT } from '@/components/molecules/SiteHeader/SiteHeader';

type ProductHeaderProps = {
  product: Product;
  path: string;
};

export const PRODUCT_HEADER_HEIGHT = 77;

const ProductHeader: FC<ProductHeaderProps> = ({ product, path }) => {
  const { palette } = useTheme();
  const scrollUp = useScrollUp();

  const themeVariant = palette.mode;
  return (
    <Box
      sx={{
        position: 'fixed',
        top: scrollUp ? SITE_HEADER_HEIGHT : 0,
        zIndex: scrollUp ? 90 : 250,
        transition: 'top 0.5s linear',
        width: '100vw',
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

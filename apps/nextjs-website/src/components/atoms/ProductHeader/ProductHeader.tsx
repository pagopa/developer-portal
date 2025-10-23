'use client';
import { productToMenuItems } from '@/helpers/productHeader.helper';
import { Product } from '@/lib/types/product';
import { Box, useTheme } from '@mui/material';
import { Header } from '@/editorialComponents/Header';
import React, { FC } from 'react';
import { SITE_HEADER_HEIGHT } from '@/components/molecules/SiteHeader/SiteHeader';
import { useTranslations } from 'next-intl';
import { useScrollUp } from './useScrollUp';

type ProductHeaderProps = {
  product: Product;
  path: string;
};

export const PRODUCT_HEADER_HEIGHT = 77;

const ProductHeader: FC<ProductHeaderProps> = ({ product, path }) => {
  const { palette } = useTheme();
  const t = useTranslations();
  const scrollUp = useScrollUp();
  const themeVariant = palette.mode;

  const menu = productToMenuItems(product, path, themeVariant).map((item) => ({
    ...item,
    label: t(item.label),
  }));
  return (
    <Box
      sx={{
        position: 'fixed',
        top: { xs: scrollUp ? SITE_HEADER_HEIGHT : 0, md: SITE_HEADER_HEIGHT },
        zIndex: scrollUp ? 90 : 250,
        transition: 'top 0.5s linear',
        width: '100vw',
      }}
    >
      <Header
        menu={menu}
        product={{
          href: `/${product.slug}/overview`,
          name: product.name,
        }}
        theme={themeVariant}
      />
    </Box>
  );
};

export default ProductHeader;

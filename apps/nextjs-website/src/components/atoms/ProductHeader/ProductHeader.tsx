'use client';
import { productToMenuItems } from '@/helpers/productHeader.helper';
import { Product } from '@/lib/types/product';
import { Box, useTheme } from '@mui/material';
import { Header } from '@/editorialComponents/Header';
import React, { FC } from 'react';
import { useTranslations } from 'next-intl';
import { useScrollUp } from './useScrollUp';
import { SITE_HEADER_HEIGHT } from '@/config';
import { useParams } from 'next/navigation';

type ProductHeaderProps = {
  product: Product;
  path: string;
};

const ProductHeader: FC<ProductHeaderProps> = ({ product, path }) => {
  const { palette } = useTheme();
  const t = useTranslations();
  const scrollUp = useScrollUp();
  const themeVariant = palette.mode;
  const { locale: currentLocale } = useParams<{ locale: string }>();

  const menu = productToMenuItems(
    currentLocale,
    product,
    path,
    themeVariant
  ).map((item) => ({
    ...item,
    label: t(item.label),
  }));
  return (
    <Box
      sx={{
        position: 'fixed',
        top: { xs: scrollUp ? SITE_HEADER_HEIGHT : 0, md: SITE_HEADER_HEIGHT },
        zIndex: { xs: scrollUp ? 90 : 250, md: 90 },
        transition: 'top 0.5s linear',
        width: '100vw',
      }}
    >
      <Header
        menu={menu}
        product={{
          href: `/${currentLocale}/${product.slug}/overview`,
          name: product.name,
        }}
        theme={themeVariant}
      />
    </Box>
  );
};

export default ProductHeader;

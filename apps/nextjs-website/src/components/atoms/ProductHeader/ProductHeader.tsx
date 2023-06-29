import { productToMenuItems } from '@/helpers/productHeader.helper';
import { Product } from '@/lib/types/product';
import { Divider, useTheme } from '@mui/material';
import { Header } from '@pagopa/pagopa-editorial-components/dist/components/Header';
import React, { FC } from 'react';

type ProductHeaderProps = {
  product: Product;
  path: string;
};

const ProductHeader: FC<ProductHeaderProps> = ({ product, path }) => {
  const { palette } = useTheme();
  const themeVariant = palette.mode;
  return (
    <>
      <Header
        menu={productToMenuItems(product, path, themeVariant)}
        product={{
          href: product.subpaths.overview.path,
          name: product.name,
        }}
        theme={themeVariant}
      />
      <Divider />
    </>
  );
};

export default ProductHeader;

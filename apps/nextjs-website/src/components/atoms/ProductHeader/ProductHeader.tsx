import { Path } from '@/lib/types/path';
import { Product } from '@/lib/types/product';
import { Divider, useTheme } from '@mui/material';
import { Header } from '@pagopa/pagopa-editorial-components/dist/components/Header';
import { Theme } from '@pagopa/pagopa-editorial-components/dist/types/components';
import React, { Fragment } from 'react';

type ProductHeaderProps = {
  product: Product;
  path: string;
};

function productToMenuItems(
  product: Product,
  path: string,
  theme: Theme
): {
  href: string;
  label: string;
  active: boolean;
  theme: Theme;
}[] {
  return Object.entries(product.subpaths)
    .filter(([name, subpath]: [string, Path]) => !!name && !!subpath)
    .map(([name, subpath]: [string, Path]) => {
      return {
        label: subpath.name || name,
        href: subpath.path,
        active: path === subpath.path,
        theme,
      };
    });
}

const ProductHeader = ({ product, path }: ProductHeaderProps) => {
  const { palette } = useTheme();
  const themeVariant = palette.mode;
  return (
    <Fragment>
      <Header
        menu={productToMenuItems(product, path, themeVariant)}
        product={{
          href: product.subpaths.overview.path,
          name: product.name,
        }}
        theme={themeVariant}
      />
      <Divider />
    </Fragment>
  );
};

export default ProductHeader;

import { Path } from '@/lib/types/path';
import { Product } from '@/lib/types/product';
import { Divider, useTheme } from '@mui/material';
import { Header } from '@pagopa/pagopa-editorial-components/dist/components/Header';
import { MenuDropdownProp } from '@pagopa/pagopa-editorial-components/dist/components/Header/components/MenuDropdown';
import { Theme } from '@pagopa/pagopa-editorial-components/dist/types/components';
import React, { FC } from 'react';

type ProductHeaderProps = {
  product: Product;
  path: string;
};

function productToMenuItems(
  product: Product,
  path: string,
  theme: Theme
): MenuDropdownProp[] {
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

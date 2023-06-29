import { Path } from '@/lib/types/path';
import { Product } from '@/lib/types/product';
import { Divider, useTheme } from '@mui/material';
import { Header } from '@pagopa/pagopa-editorial-components/dist/components/Header';
import { Theme } from '@pagopa/pagopa-editorial-components/dist/types/components';
import React, { Fragment, FC } from 'react';

type ProductHeaderProps = {
  product: Product;
  currentSlug: string;
};

function productToMenuItems(
  product: Product,
  currentSlug: string,
  theme: Theme
): MenuDropdownProp[] {
  return Object.entries(product.subpaths)
    .filter(([name, subpath]: [string, Path]) => !!name && !!subpath)
    .map(([name, subpath]: [string, Path]) => {
      return {
        label: subpath.name || name,
        href: subpath.path,
        active: currentSlug === subpath.path,
        theme,
      };
    });
}

const ProductHeader: FC<ProductHeaderProps> = ({ product, currentSlug }) => {
  const { palette } = useTheme();
  const themeVariant = palette.mode;
  return (
    <Fragment>
      <Header
        menu={productToMenuItems(product, currentSlug, themeVariant)}
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

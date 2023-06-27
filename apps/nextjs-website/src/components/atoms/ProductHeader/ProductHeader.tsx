import { Path } from '@/lib/types/path';
import { Product } from '@/lib/types/product';
import { Divider, useTheme } from '@mui/material';
import { Header } from '@pagopa/pagopa-editorial-components/dist/components/Header';
import { Theme } from '@pagopa/pagopa-editorial-components/dist/types/components';
import React, { Fragment } from 'react';

type ProductHeaderProps = {
  product: Product;
  slug: string;
};

function productToMenuItems(
  product: Product,
  slug: string,
  theme: Theme
): {
  href: string;
  label: string;
  active: boolean;
  theme: Theme;
}[] {
  return Object.entries(product.paths)
    .filter(([name, path]: [string, Path]) => !!name && !!path)
    .map(([name, path]: [string, Path]) => {
      return {
        label: path.name || name,
        href: path.slug,
        active: slug === path.slug,
        theme,
      };
    });
}

const ProductHeader = ({ product, slug }: ProductHeaderProps) => {
  const { palette } = useTheme();
  const themeVariant = palette.mode;
  return (
    <Fragment>
      <Header
        menu={productToMenuItems(product, slug, themeVariant)}
        product={{
          href: product.paths.overview.slug,
          name: product.name,
        }}
        theme={themeVariant}
      />
      <Divider />
    </Fragment>
  );
};

export default ProductHeader;

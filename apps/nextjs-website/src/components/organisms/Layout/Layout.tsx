import SiteFooter from '@/components/atoms/SiteFooter/SiteFooter';
import ProductHeader from '@/components/atoms/ProductHeader/ProductHeader';
import SiteHeader from '@/components/molecules/SiteHeader/SiteHeader';
import { Product } from '@/lib/types/product';
import React, { Fragment, ReactNode } from 'react';

export type LayoutProps = {
  readonly products: Product[];
  readonly product?: Product;
  readonly path?: string;
};

type LayoutPropsWithChildren = {
  children: ReactNode | ReactNode[];
} & LayoutProps;

const Layout = ({
  path,
  product,
  products,
  children,
}: LayoutPropsWithChildren) => (
  <Fragment>
    <header>
      <SiteHeader products={products} />
      {product && path && <ProductHeader product={product} path={path} />}
    </header>
    <main>{children}</main>
    <SiteFooter />
  </Fragment>
);

export default Layout;

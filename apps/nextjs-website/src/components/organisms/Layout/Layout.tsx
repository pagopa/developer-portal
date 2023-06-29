import SiteFooter from '@/components/atoms/SiteFooter/SiteFooter';
import ProductHeader from '@/components/atoms/ProductHeader/ProductHeader';
import SiteHeader from '@/components/molecules/SiteHeader/SiteHeader';
import { Product } from '@/lib/types/product';
import React, { ReactNode, FC } from 'react';

export type LayoutProps = {
  readonly products: Product[];
  readonly product?: Product;
  readonly path?: string;
};

type LayoutPropsWithChildren = {
  children: ReactNode | ReactNode[];
} & LayoutProps;

const Layout: FC<LayoutPropsWithChildren> = ({
  path,
  product,
  products,
  children,
}) => (
  <>
    <header>
      <SiteHeader products={products} />
      {product && path && <ProductHeader product={product} path={path} />}
    </header>
    <main>{children}</main>
    <SiteFooter />
  </>
);

export default Layout;

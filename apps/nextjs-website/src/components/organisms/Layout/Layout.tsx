import ProductHeader from '@/components/atoms/ProductHeader/ProductHeader';
import { Product } from '@/lib/types/product';
import React, { Fragment, ReactNode, FC } from 'react';

interface LayoutProps {
  product?: Product;
  path: string;
  children: ReactNode | ReactNode[];
}

const Layout: FC<LayoutProps> = ({ path, product, children }) => (
  <Fragment>
    <header>
      {product && <ProductHeader product={product} path={path} />}
    </header>
    <main>{children}</main>
  </Fragment>
);

export default Layout;

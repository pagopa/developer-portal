import ProductHeader from '@/components/atoms/ProductHeader/ProductHeader';
import { Product } from '@/lib/types/product';
import React, { Fragment, ReactNode, FC } from 'react';

interface LayoutProps {
  currentProduct?: Product;
  currentSlug: string;
  children: ReactNode | ReactNode[];
}

const Layout: FC<LayoutProps> = ({ currentSlug, currentProduct, children }) => (
  <Fragment>
    <header>
      {currentProduct && (
        <ProductHeader product={currentProduct} currentSlug={currentSlug} />
      )}
    </header>
    <main>{children}</main>
  </Fragment>
);

export default Layout;

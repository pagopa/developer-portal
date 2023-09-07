'use client';
import SiteFooter from '@/components/atoms/SiteFooter/SiteFooter';
import ProductHeader from '@/components/atoms/ProductHeader/ProductHeader';
import SiteHeader from '@/components/molecules/SiteHeader/SiteHeader';
import { Product } from '@/lib/types/product';
import React, { ReactNode, FC } from 'react';
import BannerLinks from '@/components/molecules/BannerLinks/BannerLinks';
import ProductBreadcrumbs from '@/components/atoms/ProductBreadcrumbs/ProductBreadcrumbs';
import { productPageToBreadcrumbs } from '@/helpers/breadcrumbs.helpers';
import { BannerLinkProps } from '@/editorialComponents/BannerLink';

export type LayoutProps = {
  readonly products: Product[];
  readonly product?: Product;
  readonly path?: string;
  readonly bannerLinks?: readonly BannerLinkProps[];
  readonly showBreadcrumbs?: boolean;
};

type LayoutPropsWithChildren = {
  children: ReactNode | ReactNode[];
} & LayoutProps;

const Layout: FC<LayoutPropsWithChildren> = ({
  path,
  product,
  products,
  bannerLinks,
  children,
  showBreadcrumbs = false,
}) => (
  <>
    <header>
      <SiteHeader products={products} />
      {product && path && <ProductHeader product={product} path={path} />}
      {product && showBreadcrumbs && (
        <ProductBreadcrumbs
          breadcrumbs={[...productPageToBreadcrumbs(product, path)]}
        />
      )}
    </header>
    <main>{children}</main>
    {bannerLinks && <BannerLinks banners={bannerLinks} />}
    <SiteFooter />
  </>
);

export default Layout;

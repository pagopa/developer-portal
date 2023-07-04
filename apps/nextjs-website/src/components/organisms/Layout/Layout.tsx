import SiteFooter from '@/components/atoms/SiteFooter/SiteFooter';
import ProductHeader from '@/components/atoms/ProductHeader/ProductHeader';
import SiteHeader from '@/components/molecules/SiteHeader/SiteHeader';
import { Product } from '@/lib/types/product';
import React, { ReactNode, FC } from 'react';
import { BannerLinkProps } from '@pagopa/pagopa-editorial-components/dist/components/BannerLink';
import BannerLinks from '@/components/molecules/BannerLinks/BannerLinks';
import { Provider as MosaicProvider } from '@stoplight/mosaic';

export type LayoutProps = {
  readonly products: Product[];
  readonly product?: Product;
  readonly path?: string;
  readonly bannerLinks?: BannerLinkProps[];
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
}) => (
  <MosaicProvider>
    <header>
      <SiteHeader products={products} />
      {product && path && <ProductHeader product={product} path={path} />}
    </header>
    <main>{children}</main>
    {bannerLinks && <BannerLinks banners={bannerLinks} />}
    <SiteFooter />
  </MosaicProvider>
);

export default Layout;

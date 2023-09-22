'use client';
import SiteFooter from '@/components/atoms/SiteFooter/SiteFooter';
import ProductHeader from '@/components/atoms/ProductHeader/ProductHeader';
import SiteHeader from '@/components/molecules/SiteHeader/SiteHeader';
import { Product } from '@/lib/types/product';
import React, { ReactNode, FC, useRef } from 'react';
import { BannerLinkProps } from '@pagopa/pagopa-editorial-components/dist/components/BannerLink';
import BannerLinks from '@/components/molecules/BannerLinks/BannerLinks';
import ProductBreadcrumbs from '@/components/atoms/ProductBreadcrumbs/ProductBreadcrumbs';
import { productPageToBreadcrumbs } from '@/helpers/breadcrumbs.helpers';
import { useTheme } from '@mui/material';
import { Box } from '@mui/material';
import { useScrollUp } from './useScrollUp';

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
}) => {
  const { palette } = useTheme();
  const headerRef = useRef<HTMLDivElement>(null);
  const scrollUp = useScrollUp();

  const paddingTop = headerRef.current?.offsetHeight ?? 0;
  const transformYPosition = scrollUp ? 0 : -paddingTop;

  return (
    <>
      <Box
        component='header'
        sx={{
          transition: 'all 0.5s linear',
          transform: `translateY(${transformYPosition}px)`,
        }}
        position='sticky'
        width='100%'
        bgcolor='#fff'
        top='0'
        zIndex={10}
      >
        <SiteHeader ref={headerRef} products={products} />
        {product && path && <ProductHeader product={product} path={path} />}
        {product && showBreadcrumbs && (
          <ProductBreadcrumbs
            breadcrumbs={[...productPageToBreadcrumbs(product, path)]}
          />
        )}
      </Box>
      <main
        style={{
          backgroundColor: palette.background.paper,
        }}
      >
        {children}
      </main>
      {bannerLinks && <BannerLinks banners={bannerLinks} />}
      <SiteFooter />
    </>
  );
};

export default Layout;

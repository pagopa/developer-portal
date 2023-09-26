'use client';
import ProductHeader from '@/components/atoms/ProductHeader/ProductHeader';
import { Product } from '@/lib/types/product';
import React, { ReactNode, FC } from 'react';
import BannerLinks from '@/components/molecules/BannerLinks/BannerLinks';
import ProductBreadcrumbs from '@/components/atoms/ProductBreadcrumbs/ProductBreadcrumbs';
import { productPageToBreadcrumbs } from '@/helpers/breadcrumbs.helpers';
import { BannerLinkProps } from '@/editorialComponents/BannerLink';
import { useTheme } from '@mui/material';

export type ProductLayoutProps = {
  readonly product?: Product;
  readonly path?: string;
  readonly bannerLinks?: readonly BannerLinkProps[];
  readonly showBreadcrumbs?: boolean;
};

type LayoutPropsWithChildren = {
  children: ReactNode | ReactNode[];
} & ProductLayoutProps;

const ProductLayout: FC<LayoutPropsWithChildren> = ({
  path,
  product,
  bannerLinks,
  children,
  showBreadcrumbs = false,
}) => {
  const { palette } = useTheme();
  return (
    <>
      {product && path && <ProductHeader product={product} path={path} />}
      {product && showBreadcrumbs && (
        <ProductBreadcrumbs
          breadcrumbs={[...productPageToBreadcrumbs(product, path)]}
        />
      )}
      <main
        style={{
          backgroundColor: palette.background.paper,
        }}
      >
        {children}
      </main>
      {bannerLinks && <BannerLinks banners={bannerLinks} />}
    </>
  );
};

export default ProductLayout;

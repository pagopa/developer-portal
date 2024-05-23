'use client';
import ProductHeader from '@/components/atoms/ProductHeader/ProductHeader';
import { Product } from '@/lib/types/product';
import React, { ReactNode, FC } from 'react';
import BannerLinks from '@/components/molecules/BannerLinks/BannerLinks';
import ProductBreadcrumbs from '@/components/atoms/ProductBreadcrumbs/ProductBreadcrumbs';
import { productPageToBreadcrumbs } from '@/helpers/breadcrumbs.helpers';
import { BannerLinkProps } from '@/editorialComponents/BannerLink';
import { Path } from '@/lib/types/path';
import EContainer from '@/editorialComponents/EContainer/EContainer';

export type ProductLayoutProps = {
  readonly product?: Product;
  readonly path?: string;
  readonly paths?: Path[];
  readonly bannerLinks?: readonly BannerLinkProps[];
  readonly showBreadcrumbs?: boolean;
};

type LayoutPropsWithChildren = {
  children: ReactNode | ReactNode[];
} & ProductLayoutProps;

const ProductLayout: FC<LayoutPropsWithChildren> = ({
  path,
  paths,
  product,
  bannerLinks,
  children,
  showBreadcrumbs = false,
}) => {
  return (
    <>
      {product && path && <ProductHeader product={product} path={path} />}
      {product && showBreadcrumbs && (
        <EContainer sx={{ marginTop: 10, paddingTop: 3 }}>
          <ProductBreadcrumbs
            breadcrumbs={[...productPageToBreadcrumbs(product, path, paths)]}
          />
        </EContainer>
      )}
      {children}
      {bannerLinks && <BannerLinks banners={bannerLinks} />}
    </>
  );
};

export default ProductLayout;

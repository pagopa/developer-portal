'use client';
import ProductHeader from '@/components/atoms/ProductHeader/ProductHeader';
import { Product } from '@/lib/types/product';
import React, { ReactNode, FC } from 'react';
import BannerLinks from '@/components/molecules/BannerLinks/BannerLinks';
import ProductBreadcrumbs from '@/components/atoms/ProductBreadcrumbs/ProductBreadcrumbs';
import { productPageToBreadcrumbs } from '@/helpers/breadcrumbs.helpers';
import { BannerLinkProps } from '@/editorialComponents/BannerLink';
import { Box } from '@mui/material';
import { Path } from '@/lib/types/path';

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
        <Box marginTop={11}>
          <ProductBreadcrumbs
            breadcrumbs={[...productPageToBreadcrumbs(product, path, paths)]}
          />
        </Box>
      )}
      {children}
      {bannerLinks && <BannerLinks banners={bannerLinks} />}
    </>
  );
};

export default ProductLayout;

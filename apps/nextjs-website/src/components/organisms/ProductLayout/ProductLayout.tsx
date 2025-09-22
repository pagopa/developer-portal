'use client';
import ProductHeader from '@/components/atoms/ProductHeader/ProductHeader';
import { Product } from '@/lib/types/product';
import React, { ReactNode, FC } from 'react';
import BannerLinks from '@/components/molecules/BannerLinks/BannerLinks';
import ProductBreadcrumbs from '@/components/atoms/ProductBreadcrumbs/ProductBreadcrumbs';
import { productPageToBreadcrumbs } from '@/helpers/breadcrumbs.helpers';
import { BannerLinkData } from '@/components/atoms/BannerLink/BannerLink';
import { BreadcrumbSegment } from '@/lib/types/path';
import EContainer from '@/editorialComponents/EContainer/EContainer';
import ContentWrapper from '@/components/atoms/ContentWrapper/ContentWrapper';

export type ProductLayoutData = {
  readonly product?: Product;
  readonly path?: string;
  readonly breadcrumbSegments?: BreadcrumbSegment[];
  readonly bannerLinks?: readonly BannerLinkData[];
  readonly showBreadcrumbs?: boolean;
  readonly structuredData?: ReactNode;
};

type LayoutPropsWithChildren = {
  children: ReactNode | ReactNode[];
} & ProductLayoutData;

const ProductLayout: FC<LayoutPropsWithChildren> = ({
  path,
  breadcrumbSegments: paths,
  product,
  bannerLinks,
  children,
  showBreadcrumbs = false,
  structuredData,
}) => {
  return (
    <>
      {structuredData}
      {product && path && <ProductHeader product={product} path={path} />}
      {product && showBreadcrumbs && (
        <EContainer sx={{ marginTop: 10, paddingTop: 3 }}>
          <ProductBreadcrumbs
            breadcrumbs={[...productPageToBreadcrumbs(product, paths)]}
          />
        </EContainer>
      )}
      <ContentWrapper>{children}</ContentWrapper>
      {bannerLinks && <BannerLinks bannerLinks={bannerLinks} />}
    </>
  );
};

export default ProductLayout;

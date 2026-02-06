'use client';
import ProductHeader from '@/components/atoms/ProductHeader/ProductHeader';
import { Product } from '@/lib/types/product';
import React, { ReactNode, FC } from 'react';
import BannerLinks from '@/components/molecules/BannerLinks/BannerLinks';
import ProductBreadcrumbs from '@/components/atoms/ProductBreadcrumbs/ProductBreadcrumbs';
import { productPageToBreadcrumbs } from '@/helpers/breadcrumbs.helpers';
import { BannerLinkProps } from '@/components/atoms/BannerLink/BannerLink';
import { BreadcrumbSegment } from '@/lib/types/path';
import EContainer from '@/editorialComponents/EContainer/EContainer';
import ContentWrapper from '@/components/atoms/ContentWrapper/ContentWrapper';
import { Box } from '@mui/material';
import { PRODUCT_HEADER_HEIGHT, SITE_HEADER_HEIGHT } from '@/config';
import { useParams } from 'next/navigation';

export type ProductLayoutProps = {
  readonly product?: Product;
  readonly path?: string;
  readonly breadcrumbSegments?: BreadcrumbSegment[];
  readonly bannerLinks?: readonly BannerLinkProps[];
  readonly showBreadcrumbs?: boolean;
  readonly structuredData?: ReactNode;
};

type LayoutPropsWithChildren = {
  children: ReactNode | ReactNode[];
} & ProductLayoutProps;

const ProductLayout: FC<LayoutPropsWithChildren> = ({
  path,
  breadcrumbSegments: paths,
  product,
  bannerLinks,
  children,
  showBreadcrumbs = false,
  structuredData,
}) => {
  const { locale } = useParams<{ locale: string }>();
  const pathWithLocale = `/${locale}${path}`;
  return (
    <Box
      sx={{
        marginTop: product
          ? {
              xs: `${SITE_HEADER_HEIGHT + 40}px`,
              md: `${SITE_HEADER_HEIGHT + PRODUCT_HEADER_HEIGHT}px`,
            }
          : 0,
      }}
    >
      {structuredData}
      {product && path && (
        <ProductHeader
          locale={locale}
          product={product}
          path={pathWithLocale}
        />
      )}
      {product && showBreadcrumbs && (
        <EContainer sx={{ paddingTop: 3 }}>
          <ProductBreadcrumbs
            breadcrumbs={[...productPageToBreadcrumbs(locale, product, paths)]}
          />
        </EContainer>
      )}
      <ContentWrapper>{children}</ContentWrapper>
      {bannerLinks && <BannerLinks bannerLinks={bannerLinks} />}
    </Box>
  );
};

export default ProductLayout;

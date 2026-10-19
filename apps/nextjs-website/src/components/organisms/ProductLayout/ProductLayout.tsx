'use client';
import ProductHeader from '@/components/atoms/ProductHeader/ProductHeader';
import { Product } from '@/lib/products/types';
import React, { ReactNode, FC } from 'react';
import BannerLinks from '@/components/molecules/BannerLinks/BannerLinks';
import ProductBreadcrumbs from '@/components/atoms/ProductBreadcrumbs/ProductBreadcrumbs';
import { productPageToBreadcrumbs } from '@/helpers/breadcrumbs.helpers';
import { BannerLinkProps } from '@/components/atoms/BannerLink/BannerLink';
import type { BreadcrumbSegment } from '@/lib/paths/types';
import EContainer from '@/editorialComponents/EContainer/EContainer';
import ContentWrapper from '@/components/atoms/ContentWrapper/ContentWrapper';
import { Box } from '@mui/material';
import { browserEnv } from '@/browserConfig';
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
  const normalizedPath = path?.startsWith(`/${locale}`)
    ? path
    : `/${locale}${path}`;
  return (
    <Box
      sx={{
        marginTop: product
          ? {
              xs: `${browserEnv.config.SITE_HEADER_HEIGHT + 40}px`,
              md: `${
                browserEnv.config.SITE_HEADER_HEIGHT +
                browserEnv.config.PRODUCT_HEADER_HEIGHT
              }px`,
            }
          : 0,
      }}
    >
      {structuredData}
      {product && path && (
        <ProductHeader
          locale={locale}
          product={product}
          path={normalizedPath}
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

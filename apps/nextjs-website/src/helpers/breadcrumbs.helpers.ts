import { BreadcrumbSegment } from '@/lib/types/path';
import { Product } from '@/lib/types/product';

export function productPageToBreadcrumbs(
  product: Product,
  breadcrumbSegments?: readonly BreadcrumbSegment[]
): readonly BreadcrumbSegment[] {
  return [
    {
      name: 'breadcrumbs.home',
      path: '/',
      translate: true,
    },
    {
      name: product.name,
      path: product.hasOverviewPage
        ? `${
            product.slug.startsWith('/') ? product.slug : `/${product.slug}` // TODO: remove this control when validation will be added to Strapi
          }/overview`
        : '',
    },
    ...(breadcrumbSegments || []),
  ];
}

export function pageToBreadcrumbs(
  pagePath: string,
  paths?: readonly BreadcrumbSegment[]
): readonly BreadcrumbSegment[] {
  return [
    {
      name: 'breadcrumbs.home',
      path: '/',
      translate: true,
    },
    {
      name: `breadcrumbs.${pagePath}`,
      path: `/${pagePath}`,
      translate: true,
    },
    ...(paths || []),
  ];
}

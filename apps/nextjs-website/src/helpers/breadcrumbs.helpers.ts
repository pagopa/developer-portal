import { BreadcrumbSegment, Path } from '@/lib/types/path';
import { Product } from '@/lib/types/product';

export function productPageToBreadcrumbs(
  product: Product,
  breadcrumbSegments?: readonly BreadcrumbSegment[]
): readonly BreadcrumbSegment[] {
  return [
    {
      name: 'home',
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
  paths?: readonly Path[]
): readonly BreadcrumbSegment[] {
  return [
    {
      name: 'home',
      path: '/',
      translate: true,
    },
    {
      name: pagePath,
      path: `/${pagePath}`,
      translate: true,
    },
    ...(paths || []),
  ];
}

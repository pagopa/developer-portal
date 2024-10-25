import { BreadcrumbSegment, Path } from '@/lib/types/path';
import { Product } from '@/lib/types/product';

export function productPageToBreadcrumbs(
  product: Product,
  path?: string,
  paths?: readonly Path[]
): readonly BreadcrumbSegment[] {
  return [
    {
      name: 'home',
      path: '/',
      translate: true,
    },
    {
      name: product.name,
      path: `${
        product.slug.startsWith('/') ? product.slug : `/${product.slug}`
      }/overview`,
    },
    ...(paths || []),
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

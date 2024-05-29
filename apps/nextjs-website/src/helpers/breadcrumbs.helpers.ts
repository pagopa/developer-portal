import { BreadCrumbSegment, Path } from '@/lib/types/path';
import { Product } from '@/lib/types/product';

export function productPageToBreadcrumbs(
  product: Product,
  path?: string,
  paths?: readonly Path[]
): readonly BreadCrumbSegment[] {
  const subpath = Object.entries(product.subpaths)
    .filter(([, subpath]) => path?.includes(subpath.path))
    .map(([, subpath]) => subpath);
  return [
    {
      name: 'home',
      path: '/',
      translate: true,
    },
    {
      name: product.name,
      path: product.subpaths.overview.path,
    },
    ...subpath,
    ...(paths || []),
  ];
}

export function webinarPageToBreadcrumbs(
  paths?: readonly Path[]
): readonly BreadCrumbSegment[] {
  return [
    {
      name: 'home',
      path: '/',
      translate: true,
    },
    {
      name: 'webinars',
      path: '/webinars',
      translate: true,
    },
    ...(paths || []),
  ];
}

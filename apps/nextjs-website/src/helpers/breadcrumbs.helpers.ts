import { translations } from '@/_contents/translations';
import { Path } from '@/lib/types/path';
import { Product } from '@/lib/types/product';

export function productPageToBreadcrumbs(
  product: Product,
  path?: string,
  paths?: readonly Path[]
): readonly Path[] {
  const subpath = Object.entries(product.subpaths)
    .filter(([, subpath]) => path?.includes(subpath.path))
    .map(([, subpath]) => subpath);
  return [
    {
      name: translations.breadcrumbs.title,
      path: '/',
    },
    {
      name: product.name,
      path: product.subpaths.overview.path,
    },
    ...subpath,
    ...(paths || []),
  ];
}

export function pathToBreadcrumbs(path: string): readonly Path[] {
  const slugs = path.split('/');
  if (slugs.length < 4) {
    return [];
  }

  const name = slugs[slugs.length - 1].replaceAll('-', ' ');
  return [
    {
      name,
      path: path,
    },
  ];
}

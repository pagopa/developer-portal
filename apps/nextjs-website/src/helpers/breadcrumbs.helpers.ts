import { Path } from '@/lib/types/path';
import { Product } from '@/lib/types/product';

export function productPageToBreadcrumbs(props: {
  readonly homepageTitle: string;
  readonly product: Product;
  readonly path?: string;
  readonly paths?: readonly Path[];
}): readonly Path[] {
  const { homepageTitle, product, path, paths } = props;
  const subpath = Object.entries(product.subpaths)
    .filter(([, subpath]) => path?.includes(subpath.path))
    .map(([, subpath]) => subpath);
  return [
    {
      name: homepageTitle,
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
  const slugs = path.split('/').filter(Boolean);
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

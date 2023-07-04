import { translations } from '@/_contents/translations';
import { Path } from '@/lib/types/path';
import { Product } from '@/lib/types/product';

export function productPageToBreadcrumbs(
  product: Product,
  paths?: readonly Path[]
): readonly Path[] {
  return [
    {
      name: translations.breadcrumbs.title,
      path: '/',
    },
    {
      name: product.name,
      path: product.path,
    },
    ...(paths || []),
  ];
}

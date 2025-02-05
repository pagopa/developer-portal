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

export function gitBookPageToBreadcrumbs(
  pagePath: string,
  gitBookPagesWithTitle: readonly {
    readonly title: string;
    readonly path: string;
  }[]
): readonly BreadcrumbSegment[] {
  const currentPageBreadcrumbPaths = pagePath
    .split('/')
    .filter(Boolean)
    .map((_, index, arr) => '/' + arr.slice(0, index + 1).join('/'))
    .slice(2);

  return gitBookPagesWithTitle
    .filter(({ path }) => currentPageBreadcrumbPaths.includes(path))
    .map(({ title, path }) => ({
      name: title,
      path,
    }))
    .sort((a, b) => a.path.length - b.path.length);
}

import { BreadcrumbSegment } from '@/lib/types/path';
import { Product } from '@/lib/types/product';

export type BreadcrumbItem = { readonly name?: string; readonly item?: string };

export function productPageToBreadcrumbs(
  locale: string,
  product: Product,
  breadcrumbSegments?: readonly BreadcrumbSegment[]
): readonly BreadcrumbSegment[] {
  return [
    {
      name: 'breadcrumbs.home',
      path: `/${locale}`,
      translate: true,
    },
    {
      name: product.name,
      path: product.hasOverviewPage
        ? `/${locale}${
            product.slug.startsWith('/') ? product.slug : `/${product.slug}` // TODO: remove this control when validation will be added to Strapi
          }/overview`
        : '',
    },
    ...(breadcrumbSegments || []),
  ];
}

export function pageToBreadcrumbs(
  locale: string,
  pagePath: string,
  paths?: readonly BreadcrumbSegment[]
): readonly BreadcrumbSegment[] {
  return [
    {
      name: 'breadcrumbs.home',
      path: `/${locale}`,
      translate: true,
    },
    {
      name: `breadcrumbs.${pagePath}`,
      path: `/${locale}/${pagePath}`,
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
  // Generate a list of hierarchical breadcrumb paths from the page path
  // (e.g., '/send/release-note/2023/16-ottobre-2023' -> [ '/send/release-note/2023', '/send/release-note/2023/16-ottobre-2023'])
  const currentPageBreadcrumbPaths = pagePath
    .split('/') // Split the path into parts based on '/'
    .filter(Boolean) // Remove empty segments (e.g., leading or trailing slashes)
    .map((_, index, arr) => '/' + arr.slice(0, index + 1).join('/')) // Reconstruct breadcrumb paths
    .slice(2); // Ignore the first two levels

  // Match breadcrumb paths with available pages and sort them in hierarchical order
  return gitBookPagesWithTitle
    .filter(({ path }) => currentPageBreadcrumbPaths.includes(path)) // Keep only the paths present in breadcrumbs
    .map(({ title, path }) => ({
      name: title,
      path,
    }))
    .sort((a, b) => a.path.length - b.path.length); // Sort breadcrumbs by path length (ensuring hierarchy)
}

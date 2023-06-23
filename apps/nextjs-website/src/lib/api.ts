import { overviews } from '@/_contents/products';

export function getOverviewPaths(): readonly string[] {
  return overviews.map((overview) => overview.slug);
}

export function getOverview(productSlug?: string) {
  return overviews.find(
    (overviewData) => overviewData.product.slug === productSlug
  );
}

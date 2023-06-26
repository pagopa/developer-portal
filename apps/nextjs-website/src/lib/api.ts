import { overviews, productsGuides } from '@/_contents/products';

export function getGuidesPaths(): readonly string[] {
  return productsGuides.map((productGuides) => productGuides.slug);
}

export function getOverviewPaths(): readonly string[] {
  return overviews.map((overview) => overview.slug);
}

export function getGuides(productSlug?: string) {
  return productsGuides.find(
    (productGuides) => productGuides.product.slug === productSlug
  );
}

export function getOverview(productSlug?: string) {
  return overviews.find(
    (overviewData) => overviewData.product.slug === productSlug
  );
}

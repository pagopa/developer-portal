import { overviews, productsGuides } from '@/_contents/products';

export function getGuidesPaths(): readonly string[] {
  return productsGuides.map((productGuides) => productGuides.path);
}

export function getOverviewPaths(): readonly string[] {
  return overviews.map((overview) => overview.path);
}

export function getGuides(productSlug?: string) {
  return productsGuides.find(
    (productGuides) => productGuides.product.path === productSlug
  );
}

export function getOverview(productSlug?: string) {
  return overviews.find(
    (overviewData) => overviewData.product.path === productSlug
  );
}

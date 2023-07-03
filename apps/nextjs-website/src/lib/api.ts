import { overviews, products, guideLists } from '@/_contents/products';
import { Product } from './types/product';

export function getGuideListsPaths(): readonly string[] {
  return guideLists.map((guideList) => guideList.path);
}

export function getOverviewPaths(): readonly string[] {
  return overviews.map((overview) => overview.path);
}

export function getProducts(): readonly Product[] {
  return products;
}

export function getGuideLists(productSlug?: string) {
  return guideLists.find(
    (guideList) => guideList.product.path === `/${productSlug}`
  );
}

export function getOverview(productSlug?: string) {
  return overviews.find(
    (overviewData) => overviewData.product.path === `/${productSlug}`
  );
}

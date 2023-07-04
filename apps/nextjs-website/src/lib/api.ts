import { apis, overviews, products, guideLists } from '@/_contents/products';
import { Product } from './types/product';

export function getProducts(): readonly Product[] {
  return products;
}

export function getOverviewPaths(): readonly string[] {
  return overviews.map((overview) => overview.path);
}

export function getApiPaths(): readonly string[] {
  return apis.map((api) => api.path);
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

export function getApi(productSlug?: string) {
  return apis.find((apiData) => apiData.product.path === `/${productSlug}`);
}

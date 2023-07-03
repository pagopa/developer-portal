import {
  apis,
  overviews,
  productsGuides,
  products,
} from "@/_contents/products";
import { Product } from "./types/product";

export function getGuidesPaths(): readonly string[] {
  return productsGuides.map((productGuides) => productGuides.path);
}

export function getOverviewPaths(): readonly string[] {
  return overviews.map((overview) => overview.path);
}

export function getApiPaths(): readonly string[] {
  return apis.map((api) => api.path);
}
export function getProducts(): readonly Product[] {
  return products;
}

export function getGuides(productSlug?: string) {
  return productsGuides.find(
    (productGuides) => productGuides.product.path === `/${productSlug}`
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

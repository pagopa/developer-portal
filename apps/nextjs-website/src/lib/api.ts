import {
  apis,
  overviews,
  products,
  guideLists,
  guides,
  tutorials,
  tutorialLists,
  quickStartGuides,
} from '@/_contents/products';
import { Product } from './types/product';

export function getApi(productSlug?: string) {
  return apis.find((apiData) => apiData.product.path === `/${productSlug}`);
}

export function getApiPaths(): readonly string[] {
  return apis.map((api) => api.path);
}

export function getGuide(path?: string) {
  return guides.find(({ page }) => page.path === path);
}

export function getGuidePaths() {
  return guides.map(({ page: { path } }) => path);
}

export function getGuideLists(productSlug?: string) {
  return guideLists.find(
    (guideList) => guideList.product.path === `/${productSlug}`
  );
}

export function getGuideListsPaths(): readonly string[] {
  return guideLists.map((guideList) => guideList.path);
}

export function getOverview(productSlug?: string) {
  return overviews.find(
    (overviewData) => overviewData.product.path === `/${productSlug}`
  );
}

export function getOverviewPaths(): readonly string[] {
  return overviews.map((overview) => overview.path);
}

export function getProducts(): readonly Product[] {
  return products;
}

export function getQuickStartGuide(productSlug?: string) {
  return quickStartGuides.find(
    (overviewData) => overviewData.product.path === `/${productSlug}`
  );
}

export function getQuickStartGuidePaths(): readonly string[] {
  return quickStartGuides.map((overview) => overview.path);
}

export function getTutorial(path?: string) {
  return tutorials.find(({ page }) => page.path === path);
}

export function getTutorialPaths() {
  return tutorials.map(({ page: { path } }) => path);
}

export function getTutorialLists(productSlug?: string) {
  return tutorialLists.find(
    (tutorialList) => tutorialList.product.path === `/${productSlug}`
  );
}

export function getTutorialListsPaths(): readonly string[] {
  return tutorialLists.map((tutorialList) => tutorialList.path);
}

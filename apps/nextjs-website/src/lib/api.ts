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
import { Product, ProductSubpathsKeys } from './types/product';

function manageUndefined<T>(props: undefined | null | T) {
  if (!props) {
    // eslint-disable-next-line functional/no-throw-statements
    throw new Error('Failed to fetch data');
  }
  return props;
}

async function manageUndefinedAndAddProduct<T>(props: undefined | null | T) {
  return { ...manageUndefined(props), products: [...(await getProducts())] };
}

export async function getApi(productSlug?: string) {
  const props =
    apis.find((apiData) => apiData.product.path === `/${productSlug}`) || null;

  return manageUndefinedAndAddProduct(props);
}

export async function getGuide(
  productSlug?: string,
  productGuidePage?: ReadonlyArray<string>
) {
  const guidePath = productGuidePage?.join('/');
  const path = `/${productSlug}/guides/${guidePath}`;
  const props = manageUndefined(guides.find(({ page }) => page.path === path));

  return {
    ...props,
    pathPrefix: props.source.pathPrefix,
    assetsPrefix: props.source.assetsPrefix,
    products: [...(await getProducts())],
  };
}

export function getGuidePaths() {
  return guides.map((guide) => ({
    slug: guide.product.slug,
    // the filter is to remove the first 3 elements of the path which are
    // an empty string (the path begins with a / symbol), the product slug and 'guides' hard-coded string
    guidePaths: guide.page.path.split('/').filter((p, index) => index > 2),
  }));
}

export async function getGuideLists(productSlug?: string) {
  const props =
    guideLists.find(
      (guideList) => guideList.product.path === `/${productSlug}`
    ) || null;
  return manageUndefinedAndAddProduct(props);
}

export async function getOverview(productSlug?: string) {
  const props =
    overviews.find(
      (overviewData) => overviewData.product.path === `/${productSlug}`
    ) || null;
  return manageUndefinedAndAddProduct(props);
}

export function getProductsSlugs(
  page?: ProductSubpathsKeys
): readonly string[] {
  return products
    .filter((p) => !page || Object.keys(p.subpaths).includes(page))
    .map(({ slug }) => slug);
}

export async function getProducts(): Promise<readonly Product[]> {
  return [...products];
}

export async function getQuickStartGuide(productSlug?: string) {
  const props =
    quickStartGuides.find(
      (overviewData) => overviewData.product.path === `/${productSlug}`
    ) || null;
  return manageUndefinedAndAddProduct(props);
}

export async function getTutorial(
  productSlug?: string,
  productTutorialPage?: ReadonlyArray<string>
) {
  const tutorialPath = productTutorialPage?.join('/');
  const path = `/${productSlug}/tutorials/${tutorialPath}`;
  const props = manageUndefined(
    tutorials.find(({ page }) => page.path === path)
  );

  return {
    ...props,
    product: props.product,
    pathPrefix: props.source.pathPrefix,
    assetsPrefix: props.source.assetsPrefix,
    products: [...(await getProducts())],
    bannerLinks: props.bannerLinks,
  };
}

export function getTutorialPaths() {
  return tutorials.map((tutorial) => ({
    slug: tutorial.product.slug,
    tutorialPaths: tutorial.page.path
      .split('/')
      // the filter is to remove the first 3 elements of the path which are
      // an empty string (the path begins with a / symbol), the product slug and 'tutorials' hard-coded string
      .filter((p, index) => index > 2),
  }));
}

export async function getTutorialLists(productSlug?: string) {
  const props =
    tutorialLists.find(
      (tutorialList) => tutorialList.product.path === `/${productSlug}`
    ) || null;
  return manageUndefinedAndAddProduct(props);
}

import {
  apis,
  guideLists,
  guides,
  overviews,
  products,
  quickStartGuides,
  tutorialLists,
  tutorials,
} from '@/_contents/products';
import { Product, ProductSubpathsKeys } from './types/product';
import { Webinar } from '@/lib/types/webinar';
import { webinars } from '@/_contents/webinars';
import { GuidePage } from './types/guideData';

const VERSION_REGEX = /v?\d+\.\d+\.\d+/;

function manageUndefined<T>(props: undefined | null | T) {
  if (!props) {
    // eslint-disable-next-line functional/no-throw-statements
    throw new Error('Failed to fetch data');
  }
  return props;
}

async function manageUndefinedAndAddProduct<T>(props: undefined | null | T) {
  return { ...manageUndefined(props), products: await getProducts() };
}

export async function getApi(productSlug?: string) {
  const props =
    apis.find((apiData) => apiData.product.path === `/${productSlug}`) || null;

  return manageUndefinedAndAddProduct(props);
}

export async function getGuide(
  productSlug?: string,
  productGuidePage?: ReadonlyArray<string>
): Promise<GuidePage> {
  const guidePath = productGuidePage?.join('/');
  const path = `/${productSlug}/guides/${guidePath}`;

  const guide =
    guides.find(({ page }) => page.path === path) ?? getMainGuide(path);
  const props = manageUndefined(guide);

  const isPathWithMainVersion =
    props.version.main && !path.startsWith(props.version.path);

  // We need to redirect to the main version if the user is trying to access to a url without version
  // Example: /sanp/specifiche-attuative-del-nodo-dei-pagamenti-spc/changelog
  // We need to redirect to /sanp/3.6.0/specifiche-attuative-del-nodo-dei-pagamenti-spc/changelog

  if (isPathWithMainVersion) {
    // Check if the current path has a version in it
    const hasVersionInPath = (guidePath ?? '').match(VERSION_REGEX);
    const sliceFrom = hasVersionInPath ? 2 : 1;
    const to = [
      props.version.path,
      ...(productGuidePage ?? []).slice(sliceFrom),
    ].join('/');

    // Check if the guide exists
    const guide = await getGuide(productSlug, getProductGuidePath(to));
    return {
      ...guide,
      redirect: true,
    };
  }

  return {
    ...props,
    pathPrefix: props.source.pathPrefix,
    assetsPrefix: props.source.assetsPrefix,
    products: [...(await getProducts())],
  };
}

function getMainGuide(path?: string) {
  const guidePath = path?.split('/').filter((p, index) => index < 4);

  return guides.find(
    ({ version, guide }) =>
      guide.path === guidePath?.join('/') && version.main === true
  );
}

function getProductGuidePath(path: string) {
  // the filter is to remove the first 3 elements of the path which are
  // an empty string (the path begins with a / symbol), the product slug and 'guides' hard-coded string
  return path.split('/').filter((p, index) => index > 2);
}

export function getGuidePaths() {
  return guides.map((guide) => ({
    slug: guide.product.slug,
    guidePaths: getProductGuidePath(guide.page.path),
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

export async function getWebinars(): Promise<readonly Webinar[]> {
  return webinars;
}

export async function getVisibleInHomeWebinars(): Promise<readonly Webinar[]> {
  return webinars.filter((webinar) => webinar.isVisibleInHome);
}

export async function getWebinar(webinarSlug?: string): Promise<Webinar> {
  const props = manageUndefined(
    (await getWebinars()).find(({ slug }) => slug === webinarSlug)
  );
  return props;
}

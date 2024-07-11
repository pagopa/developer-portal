import {
  guideLists,
  guides,
  overviews,
  products,
  tutorialLists,
  tutorials,
} from '@/_contents/products';
import { Product, ProductSubpathsKeys } from './types/product';
import { Webinar } from '@/lib/types/webinar';
import { GuidePage } from './types/guideData';
import {
  getApiDataListPageProps,
  getApisDataPageProps,
  getCaseHistoriesProps,
  getProductsProps,
  getFullSolutionsProps,
  getQuickStartsProps,
  getSolutionsListProps,
  getTutorialsProps,
  getWebinarsProps,
} from './cmsApi';
import { Tutorial } from './types/tutorialData';
import { TutorialsProps } from '@/lib/tutorials';

function manageUndefined<T>(props: undefined | null | T) {
  if (!props) {
    // eslint-disable-next-line functional/no-throw-statements
    throw new Error('Failed to fetch data');
  }
  return props;
}

async function manageUndefinedAndAddProducts<T>(props: undefined | null | T) {
  return { ...manageUndefined(props), products: await getProducts() };
}

export async function getGuide(
  productSlug?: string,
  productGuidePage?: ReadonlyArray<string>
): Promise<GuidePage> {
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
  return manageUndefinedAndAddProducts(props);
}

export async function getOverview(productSlug?: string) {
  const props =
    overviews.find(
      (overviewData) => overviewData.product.path === `/${productSlug}`
    ) || null;
  return manageUndefinedAndAddProducts(props);
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
  const props = manageUndefined(
    (await getQuickStartsProps()).find(
      ({ product }) => product.slug === productSlug
    )
  );
  return manageUndefinedAndAddProducts(props);
}

export async function getStrapiTutorial(
  productSlug?: string,
  productTutorialPage?: ReadonlyArray<string>
) {
  const tutorialSubPath = productTutorialPage?.join('/');
  const tutorialPath = `/${productSlug}/tutorials/${tutorialSubPath}`;

  const tutorialsFromStrapi: TutorialsProps = await getTutorialsProps(
    productSlug
  );

  const tutorialFromStrapi = tutorialsFromStrapi.find(
    ({ path }) => path === tutorialPath
  );

  return tutorialFromStrapi
    ? {
        ...tutorialFromStrapi,
        product: products.find(({ slug }) => slug === productSlug),
      }
    : undefined;
}

export async function getStaticTutorial(
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
    relatedLinks: props.relatedLinks,
  };
}

export async function getTutorialPaths() {
  const tutorialsFromCMS = await getTutorialsProps();
  const tutorialPathsFromCMS = tutorialsFromCMS.map(({ path }) => ({
    slug: path.split('/')[1],
    tutorialPaths: [path.split('/').at(-1)],
  }));

  const tutorialPaths = tutorials.map((tutorial) => ({
    slug: tutorial.product.slug,
    tutorialPaths: tutorial.page.path
      .split('/')
      // the filter is to remove the first 3 elements of the path which are
      // an empty string (the path begins with a / symbol), the product slug and 'tutorials' hard-coded string
      .filter((p, index) => index > 2),
  }));
  return [...tutorialPaths, ...tutorialPathsFromCMS];
}

export async function getTutorialListPageProps(productSlug?: string) {
  const props =
    tutorialLists.find(
      (tutorialList) => tutorialList.product.path === `/${productSlug}`
    ) || null;
  return manageUndefinedAndAddProducts(props);
}

export async function getTutorials(
  productSlug?: string
): Promise<readonly Tutorial[]> {
  const { tutorials } = await getTutorialListPageProps(productSlug);
  const tutorialsFromCMS = await getTutorialsProps(productSlug);
  return [...tutorials, ...tutorialsFromCMS];
}

export async function getVisibleInListWebinars(): Promise<readonly Webinar[]> {
  return (await getWebinarsProps()).filter(
    (webinar) => webinar.isVisibleInList
  );
}

export async function getWebinar(webinarSlug?: string): Promise<Webinar> {
  const props = manageUndefined(
    (await getWebinarsProps()).find(({ slug }) => slug === webinarSlug)
  );
  return props;
}

export async function getCaseHistory(caseHistorySlug?: string) {
  return manageUndefined(
    (await getCaseHistoriesProps()).find(
      ({ slug }: { readonly slug: string }) => slug === caseHistorySlug
    )
  );
}

export async function getApiDataListPages(productSlug: string) {
  const props = (await getApiDataListPageProps()).find(
    (apiPageData) => apiPageData.product.slug === productSlug
  );
  return props;
}

export async function getProduct(productSlug: string) {
  const props = (await getProductsProps()).find(
    (product) => product.slug === productSlug
  );
  return props;
}

export async function getApisDataPages(apiDataSlug: string) {
  const props = (await getApisDataPageProps()).find(
    (apisData) => apisData.apiDataSlug === apiDataSlug
  );
  return props;
}

export async function getSolution(solutionSlug?: string) {
  const props = manageUndefined(
    (await getFullSolutionsProps()).find(({ slug }) => slug === solutionSlug)
  );
  return props;
}

export async function getSolutionsList() {
  const solutionsListProps = await getSolutionsListProps();
  return manageUndefined(solutionsListProps);
}

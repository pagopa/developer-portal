import { products, tutorials } from '@/_contents/products';
import { Product, ProductSubpathsKeys } from './types/product';
import { Webinar } from '@/lib/types/webinar';
import { GuidePage } from './types/guideData';
import {
  getApiDataListPagesProps,
  getApiDataProps,
  getCaseHistoriesProps,
  getSolutionsProps,
  getGuideListPagesProps,
  getGuidesProps,
  getOverviewsProps,
  getProductsProps,
  getQuickStartGuidesProps,
  getSolutionListPageProps,
  getTutorialListPagesProps,
  getTutorialsProps,
  getWebinarsProps,
} from './cmsApi';
import { Tutorial } from './types/tutorialData';
import { TutorialsProps } from '@/lib/strapi/makeProps/makeTutorials';
import { makeSolution } from '@/_contents/makeDocs';
import { SolutionTemplateProps } from '@/components/templates/SolutionTemplate/SolutionTemplate';
import { withCache } from './redis';

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

  const props = manageUndefined(
    await withCache(`guides:${path}`, async () => {
      const guidesProps = await getGuidesProps();
      return guidesProps.find(({ page }) => page.path === path);
    })
  );

  return {
    ...props,
    pathPrefix: props.source.pathPrefix,
    assetsPrefix: props.source.assetsPrefix,
    products: [...(await getProducts())],
  };
}

export function getProductGuidePath(path: string) {
  // the filter is to remove the first 3 elements of the path which are
  // an empty string (the path begins with a / symbol), the product slug and 'guides' hard-coded string
  return path.split('/').filter((p, index) => index > 2);
}

export async function getGuideListPages(productSlug?: string) {
  const props = manageUndefined(
    await withCache(`guide-list-pages:${productSlug || 'all'}`, async () => {
      const pages = await getGuideListPagesProps();
      return pages.find(({ product }) => product.slug === productSlug);
    })
  );
  return manageUndefinedAndAddProducts(props);
}

export async function getOverview(productSlug?: string) {
  return manageUndefined(
    await withCache(`overview:${productSlug || 'all'}`, async () => {
      const overviews = await getOverviewsProps();
      return overviews.find(
        (overviewData) => overviewData.product.slug === productSlug
      );
    })
  );
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
    await withCache(`quickstart-guide:${productSlug || 'all'}`, async () => {
      const guides = await getQuickStartGuidesProps();
      return guides.find(({ product }) => product.slug === productSlug);
    })
  );
  return manageUndefinedAndAddProducts(props);
}

export async function getStrapiTutorial(
  productSlug?: string,
  productTutorialPage?: ReadonlyArray<string>
) {
  const tutorialSubPath = productTutorialPage?.join('/');
  const tutorialPath = `/${productSlug}/tutorials/${tutorialSubPath}`;

  return withCache(`tutorials:${tutorialPath}`, async () => {
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
  });
}

export async function getStaticTutorial(
  productSlug?: string,
  productTutorialPage?: ReadonlyArray<string>
) {
  const tutorialPath = productTutorialPage?.join('/');
  const path = `/${productSlug}/tutorials/${tutorialPath}`;

  const props = manageUndefined(
    await withCache(`static-tutorials:${path}`, async () =>
      tutorials.find(({ page }) => page.path === path)
    )
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
  const props = await withCache(
    `tutorial-list-pages:${productSlug || 'all'}`,
    async () => {
      const tutorialListPages = await getTutorialListPagesProps();
      return (
        tutorialListPages.find(({ product }) => product.slug === productSlug) ||
        null
      );
    }
  );

  return manageUndefinedAndAddProducts(props);
}

export async function getTutorials(
  productSlug?: string
): Promise<readonly Tutorial[]> {
  return withCache(`tutorials-combined:${productSlug || 'all'}`, async () => {
    const { tutorials } = await getTutorialListPageProps(productSlug);
    const tutorialsFromCMS = await getTutorialsProps(productSlug);
    return [...tutorials, ...tutorialsFromCMS];
  });
}

export async function getVisibleInListWebinars(): Promise<readonly Webinar[]> {
  return withCache('webinars-visible:all', async () => {
    const webinars = await getWebinarsProps();
    return webinars.filter((webinar) => webinar.isVisibleInList);
  });
}

export async function getWebinar(webinarSlug?: string): Promise<Webinar> {
  return manageUndefined(
    await withCache(`webinar:${webinarSlug || 'all'}`, async () => {
      const webinars = await getWebinarsProps();
      return webinars.find(({ slug }) => slug === webinarSlug);
    })
  );
}

export async function getCaseHistory(caseHistorySlug?: string) {
  return manageUndefined(
    await withCache(`case-history:${caseHistorySlug || 'all'}`, async () => {
      const histories = await getCaseHistoriesProps();
      return histories.find(({ slug }) => slug === caseHistorySlug);
    })
  );
}

export async function getApiDataParams() {
  return withCache('api-data-params:all', async () => {
    const props = (await getApiDataListPagesProps()).flatMap(
      (apiDataListPageProps) =>
        apiDataListPageProps.apiRestDetailSlugs.map((apiDataSlug) => ({
          productSlug: apiDataListPageProps.product.slug,
          apiDataSlug,
        }))
    );
    return props || [];
  });
}

export async function getApiDataListPages(productSlug: string) {
  return withCache(`api-data-list-pages:${productSlug}`, async () => {
    const pages = await getApiDataListPagesProps();
    return pages.find(
      (apiDataListPageProps) =>
        apiDataListPageProps.product.slug === productSlug
    );
  });
}

export async function getProduct(productSlug: string) {
  return withCache(`product:${productSlug}`, async () => {
    const products = await getProductsProps();
    return products.find((product) => product.slug === productSlug);
  });
}

export async function getApiData(apiDataSlug: string) {
  return withCache(`api-data:${apiDataSlug}`, async () => {
    const apiDataList = await getApiDataProps();
    return apiDataList.find((apiData) => apiData.apiDataSlug === apiDataSlug);
  });
}

export async function getSolution(solutionSlug?: string) {
  return manageUndefined(
    await withCache(`solution:${solutionSlug || 'all'}`, async () => {
      const solutions = await getSolutionsProps();
      return solutions.find(({ slug }) => slug === solutionSlug);
    })
  );
}

export async function getSolutionListPage() {
  return manageUndefined(
    await withCache('solution-list-page:all', async () => {
      return getSolutionListPageProps();
    })
  );
}

export async function getSolutionDetail(
  solutionSlug: string,
  solutionSubPathSlugs: readonly string[]
) {
  const path = `/solutions/${solutionSlug}/${solutionSubPathSlugs.join('/')}`;

  return withCache(`solution-detail:${path}`, async () => {
    const solutionsFromStrapi = await getSolutionsProps();
    const solutionFromStrapi = solutionsFromStrapi.find(
      ({ slug }) => slug === solutionSlug
    );

    if (!solutionFromStrapi) {
      return undefined;
    }

    const parsedSolutions = makeSolution(solutionFromStrapi);
    return parsedSolutions.find(({ page }) => page.path === path);
  });
}

export function getSolutionSubPaths(
  solutionTemplateProps: SolutionTemplateProps
) {
  return makeSolution(solutionTemplateProps).map(({ page, solution }) => {
    const path = page.path.split('/').filter((_, index) => index > 2);

    return {
      solutionSlug: solution.slug,
      solutionSubPathSlugs: path,
    };
  });
}

import { Product } from './types/product';
import { Webinar } from '@/lib/types/webinar';
import { GuidePage } from './types/guideData';
import {
  getApiDataListPagesProps,
  getApiDataProps,
  getCaseHistoriesProps,
  getGuideListPagesProps,
  getGuidePageProps,
  getGuideProps,
  getOverviewsProps,
  getProductsProps,
  getQuickStartGuidesProps,
  getReleaseNoteProps,
  getSolutionListPageProps,
  getSolutionProps,
  getSolutionsProps,
  getTutorialListPagesProps,
  getTutorialsProps,
  getWebinarsProps,
} from './cmsApi';
import { parseS3GuidePage } from '@/helpers/parseS3Doc.helpers';
import { getGuidesMetadata } from '@/helpers/s3Metadata.helpers';

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

export async function getGuidePage(
  guidePaths: ReadonlyArray<string>,
  productSlug: string
) {
  const products = await getProducts();
  const guideProps = await getGuidePageProps(
    guidePaths.length > 0 ? guidePaths[0] : '',
    productSlug
  );
  const guidesMetadata = await getGuidesMetadata();
  const guidePath = [
    `/${guideProps.product.slug}`,
    'guides',
    ...guidePaths,
  ].join('/');
  return manageUndefined(
    await parseS3GuidePage({
      guideProps,
      guidePath,
      guidesMetadata,
      products,
    })
  );
}

export async function getGuide(
  productSlug?: string,
  productGuideSlugs?: ReadonlyArray<string>
): Promise<GuidePage> {
  if (!productSlug || !productGuideSlugs || productGuideSlugs?.length < 1) {
    // eslint-disable-next-line functional/no-throw-statements
    throw new Error('Product slug is missing');
  }

  const guides = await getGuideProps(productGuideSlugs, productSlug);
  const guidePath = productGuideSlugs?.join('/');
  const path = `/${productSlug}/guides/${guidePath}`;
  const products = await getProducts();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const guideDefinition: any = manageUndefined(
    guides.find((guideDefinition) => {
      return guideDefinition.page.path === path;
    })
  );

  return {
    ...guideDefinition,
    products,
    bodyConfig: {
      isPageIndex: guideDefinition.page.isIndex,
      pagePath: guideDefinition.page.path,
      assetsPrefix: guideDefinition.source.assetsPrefix,
      gitBookPagesWithTitle: [],
      spaceToPrefix: [],
    },
  };
}

export function getGitBookSubPaths(path: string) {
  // the filter is to remove the first 3 elements of the path which are
  // an empty string (the path begins with a / symbol), the product slug and 'guides' hard-coded string
  return path.split('/').filter((p, index) => index > 2);
}

export async function getGuideListPages(productSlug?: string) {
  const props = manageUndefined(
    (await getGuideListPagesProps()).find(
      ({ product }) => product.slug === productSlug
    )
  );
  return manageUndefinedAndAddProducts(props);
}

export async function getOverview(productSlug?: string) {
  return manageUndefined(
    (await getOverviewsProps()).find(
      (overviewData) => overviewData.product.slug === productSlug
    )
  );
}

export async function getProducts(): Promise<readonly Product[]> {
  return await getProductsProps();
}

export async function getQuickStartGuide(productSlug?: string) {
  const props = manageUndefined(
    (await getQuickStartGuidesProps()).find(
      ({ product }) => product.slug === productSlug
    )
  );
  return manageUndefinedAndAddProducts(props);
}

export async function getTutorial(
  productSlug: string,
  productTutorialPage?: ReadonlyArray<string>
) {
  const tutorialSubPath = productTutorialPage?.join('/');
  const tutorialPath = `/${productSlug}/tutorials/${tutorialSubPath}`;

  const product = await getProduct(productSlug);

  const props = manageUndefined(
    (await getTutorialsProps()).find(({ path }) => path === tutorialPath)
  );
  return {
    ...props,
    product,
  };
}

export async function getTutorialPaths() {
  const tutorialsFromCMS = await getTutorialsProps();
  const tutorialPathsFromCMS = tutorialsFromCMS.map(({ path }) => ({
    slug: path.split('/')[1],
    tutorialPaths: [path.split('/').at(-1)],
  }));
  return tutorialPathsFromCMS;
}

export async function getTutorialListPageProps(productSlug?: string) {
  const tutorialListPages = await getTutorialListPagesProps();
  const props =
    tutorialListPages.find(({ product }) => product.slug === productSlug) ||
    null;

  return manageUndefinedAndAddProducts(props);
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

export async function getApiDataParams() {
  const props = (await getApiDataListPagesProps()).flatMap(
    (apiDataListPageProps) =>
      apiDataListPageProps.apiRestDetailSlugs.map((apiDataSlug) => ({
        productSlug: apiDataListPageProps.product.slug,
        apiDataSlug,
      }))
  );

  return props || [];
}

export async function getApiDataListPages(productSlug: string) {
  const props = (await getApiDataListPagesProps()).find(
    (apiDataListPageProps) => apiDataListPageProps.product.slug === productSlug
  );
  return props;
}

export async function getProduct(productSlug: string) {
  const props = (await getProductsProps()).find(
    (product) => product.slug === productSlug
  );
  return props;
}

export async function getApiData(apiDataSlug: string) {
  const props = manageUndefined(
    (await getApiDataProps()).find(
      (apiData) => apiData.apiDataSlug === apiDataSlug
    )
  );
  return props;
}

export async function getReleaseNote(
  productSlug: string,
  releaseNoteSubPathSlugs?: readonly string[]
) {
  const products = await getProducts();
  const releaseNotesPath = releaseNoteSubPathSlugs?.join('/');
  const path = `/${productSlug}/${releaseNotesPath}`;
  const releaseNoteProps = manageUndefined(
    (
      await getReleaseNoteProps(productSlug, releaseNoteSubPathSlugs || [])
    ).find(({ page }) => page.path === path)
  );

  return {
    ...releaseNoteProps,
    products,
    bodyConfig: {
      isPageIndex: releaseNoteProps.page.isIndex,
      pagePath: releaseNoteProps.page.path,
      assetsPrefix: releaseNoteProps.source.assetsPrefix,
      gitBookPagesWithTitle: [
        {
          title: releaseNoteProps.page.title,
          path: releaseNoteProps.page.path,
        },
      ],
      spaceToPrefix: [
        {
          spaceId: releaseNoteProps.source.spaceId,
          pathPrefix: releaseNoteProps.source.pathPrefix,
        },
      ],
    },
  };
}

export async function getSolution(solutionSlug?: string) {
  const props = manageUndefined(
    (await getSolutionsProps()).find(({ slug }) => slug === solutionSlug)
  );
  return props;
}

export async function getSolutionListPage() {
  const solutionListPageProps = await getSolutionListPageProps();
  return manageUndefined(solutionListPageProps);
}

export async function getSolutionDetail(
  solutionSlug: string,
  solutionSubPathSlugs: readonly string[]
) {
  const solutionsFromStrapi = await getSolutionProps(
    solutionSlug,
    solutionSubPathSlugs
  );

  return solutionsFromStrapi.find(
    ({ page }) =>
      page.path ===
      `/solutions/${solutionSlug}/${solutionSubPathSlugs.join('/')}`
  );
}

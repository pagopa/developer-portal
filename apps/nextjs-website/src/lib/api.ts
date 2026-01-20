import { Product } from './types/product';
import { Webinar } from '@/lib/types/webinar';
import {
  getApiDataListPagesProps,
  getApiDataProps,
  getCaseHistoriesProps,
  getGuideListPagesProps,
  getGuidePageProps,
  getOverviewsProps,
  getProductsProps,
  getQuickStartGuidesProps,
  getReleaseNoteProps,
  getSolutionListPageProps,
  getSolutionProps,
  getSolutionsProps,
  getStrapiReleaseNotes,
  getTutorialListPagesProps,
  getTutorialsProps,
  getUseCaseListPagesProps,
  getUseCasesProps,
  getWebinarsProps,
} from './cmsApi';
import { parseS3GuidePage } from '@/helpers/parseS3Doc.helpers';
import {
  downloadFileAsText,
  getGuidesMetadata,
  getReleaseNotesMetadata,
  getSolutionsMetadata,
} from '@/helpers/s3Metadata.helpers';
import { s3DocsPath } from '@/config';

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

export async function getMarkdownContent(
  dirName: string,
  pathToFile: string
): Promise<string> {
  const pathToMarkdownFile = `${s3DocsPath}/${dirName}/${pathToFile}`;
  const output = await downloadFileAsText(pathToMarkdownFile);
  return output || '';
}

export async function getGuidePage(
  guidePaths: ReadonlyArray<string>,
  productSlug: string
) {
  // Fetch data in parallel instead of sequential
  const [products, guideProps] = await Promise.all([
    getProducts(),
    getGuidePageProps(guidePaths.length > 0 ? guidePaths[0] : '', productSlug),
  ]);

  // Path construction
  const guidePath = [
    `/${guideProps.product.slug}`,
    'guides',
    ...guidePaths,
  ].join('/');
  const versionCheck = guidePaths.length > 1 ? guidePaths[1] : null;
  const guideToFind = guideProps.versions.find((v) => {
    return versionCheck ? v.version === versionCheck : v.main;
  });

  const guidesMetadata = await getGuidesMetadata(
    guideToFind ? guideToFind.dirName : ''
  );
  return manageUndefined(
    await parseS3GuidePage({
      guideProps,
      guidePath,
      guidesMetadata,
      products,
    })
  );
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

export async function getTutorialListPageProps(productSlug?: string) {
  const tutorialListPages = manageUndefined(
    await getTutorialListPagesProps()
  ).find(({ product }) => product.slug === productSlug);
  return manageUndefinedAndAddProducts(tutorialListPages);
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
      apiDataListPageProps.apiDetailSlugs.map((apiDataSlug) => ({
        productSlug: apiDataListPageProps.product.slug,
        apiDataSlug,
        updatedAt: apiDataListPageProps.updatedAt,
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
  const releaseNotesPath = `/${productSlug}/${releaseNoteSubPathSlugs?.join(
    '/'
  )}`;

  const releaseNote = await getStrapiReleaseNotes(productSlug);
  if (!releaseNote) {
    // eslint-disable-next-line functional/no-throw-statements
    throw new Error('Failed to fetch release notes data');
  }

  const releaseNotesMetadata = await getReleaseNotesMetadata(
    releaseNote.attributes.dirName
  );

  const releaseNoteProps = await getReleaseNoteProps(
    productSlug,
    releaseNotesMetadata.find(({ path }) => path === releaseNotesPath)
  );

  if (!releaseNoteProps) {
    return undefined;
  }

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
  const solutionData = await getSolution(solutionSlug);
  if (!solutionData) {
    // eslint-disable-next-line functional/no-throw-statements
    throw new Error('Failed to fetch solution data');
  }
  const solutionsMetadata = await getSolutionsMetadata(solutionData.dirName);

  return await getSolutionProps(
    solutionSlug,
    solutionsMetadata.find(
      ({ path }) =>
        path === `/solutions/${solutionSlug}/${solutionSubPathSlugs.join('/')}`
    )
  );
}

export async function getUseCase(
  productSlug: string,
  productUseCasePage?: ReadonlyArray<string>
) {
  const useCaseSubPath = productUseCasePage?.join('/');
  const useCasePath = `/${productSlug}/use-cases/${useCaseSubPath}`;

  const product = await getProduct(productSlug);

  const props = manageUndefined(
    (await getUseCasesProps()).find(({ path }) => path === useCasePath)
  );
  return {
    ...props,
    product,
  };
}

export async function getUseCaseListPageProps(productSlug?: string) {
  const useCaseListPages = await getUseCaseListPagesProps();
  const props =
    useCaseListPages.find(({ product }) => product.slug === productSlug) ||
    null;

  return manageUndefinedAndAddProducts(props);
}

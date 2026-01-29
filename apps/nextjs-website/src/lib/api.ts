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

async function manageUndefinedAndAddProducts<T>(
  locale: string,
  props: undefined | null | T
) {
  return { ...manageUndefined(props), products: await getProducts(locale) };
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
  locale: string,
  productSlug: string
) {
  // Fetch data in parallel instead of sequential
  const [products, guideProps] = await Promise.all([
    getProducts(locale),
    getGuidePageProps(
      guidePaths.length > 0 ? guidePaths[0] : '',
      locale,
      productSlug
    ),
    getGuidesMetadata(locale),
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

export async function getGuideListPages(locale: string, productSlug?: string) {
  const props = manageUndefined(
    (await getGuideListPagesProps(locale)).find(
      ({ product }) => product.slug === productSlug
    )
  );
  return manageUndefinedAndAddProducts(locale, props);
}

export async function getOverview(locale: string, productSlug?: string) {
  return manageUndefined(
    (await getOverviewsProps(locale)).find(
      (overviewData) => overviewData.product.slug === productSlug
    )
  );
}

export async function getProducts(locale: string): Promise<readonly Product[]> {
  return await getProductsProps(locale);
}

export async function getQuickStartGuide(locale: string, productSlug?: string) {
  const props = manageUndefined(
    (await getQuickStartGuidesProps(locale)).find(
      ({ product }) => product.slug === productSlug
    )
  );
  return manageUndefinedAndAddProducts(locale, props);
}

export async function getTutorial(
  locale: string,
  productSlug: string,
  productTutorialPage?: ReadonlyArray<string>
) {
  const tutorialSubPath = productTutorialPage?.join('/');
  const tutorialPath = `${locale}/${productSlug}/tutorials/${tutorialSubPath}`;

  const product = await getProduct(locale, productSlug);

  const props = manageUndefined(
    (await getTutorialsProps(locale)).find(({ path }) => path === tutorialPath)
  );
  return {
    ...props,
    product,
  };
}

export async function getTutorialListPageProps(
  locale: string,
  productSlug?: string
) {
  const tutorialListPages = manageUndefined(
    await getTutorialListPagesProps(locale)
  ).find(({ product }) => product.slug === productSlug);
  return manageUndefinedAndAddProducts(locale, tutorialListPages);
}

export async function getVisibleInListWebinars(
  locale: string
): Promise<readonly Webinar[]> {
  return (await getWebinarsProps(locale)).filter(
    (webinar) => webinar.isVisibleInList
  );
}

export async function getWebinar(
  locale: string,
  webinarSlug?: string
): Promise<Webinar> {
  const props = manageUndefined(
    (await getWebinarsProps(locale)).find(({ slug }) => slug === webinarSlug)
  );
  return props;
}

export async function getCaseHistory(locale: string, caseHistorySlug?: string) {
  return manageUndefined(
    (await getCaseHistoriesProps(locale)).find(
      ({ slug }: { readonly slug: string }) => slug === caseHistorySlug
    )
  );
}

export async function getApiDataParams(locale: string) {
  const props = (await getApiDataListPagesProps(locale)).flatMap(
    (apiDataListPageProps) =>
      apiDataListPageProps.apiDetailSlugs.map((apiDataSlug) => ({
        productSlug: apiDataListPageProps.product.slug,
        apiDataSlug,
        updatedAt: apiDataListPageProps.updatedAt,
      }))
  );

  return props || [];
}

export async function getApiDataListPages(locale: string, productSlug: string) {
  const props = (await getApiDataListPagesProps(locale)).find(
    (apiDataListPageProps) => apiDataListPageProps.product.slug === productSlug
  );
  return props;
}

export async function getProduct(locale: string, productSlug: string) {
  const props = (await getProductsProps(locale)).find(
    (product) => product.slug === productSlug
  );
  return props;
}

export async function getApiData(locale: string, apiDataSlug: string) {
  const props = manageUndefined(
    (await getApiDataProps(locale)).find(
      (apiData) => apiData.apiDataSlug === apiDataSlug
    )
  );
  return props;
}

export async function getReleaseNote(
  locale: string,
  productSlug: string,
  releaseNoteSubPathSlugs?: readonly string[]
) {
  const products = await getProducts(locale);
  const releaseNotesPath = `${locale}/${productSlug}/${releaseNoteSubPathSlugs?.join(
    '/'
  )}`;

  const releaseNote = await getStrapiReleaseNotes(locale, productSlug);
  if (!releaseNote) {
    // eslint-disable-next-line functional/no-throw-statements
    throw new Error('Failed to fetch release notes data');
  }

  const releaseNotesMetadata = await getReleaseNotesMetadata(
    locale,
    releaseNote.attributes.dirName
  );

  const releaseNoteProps = await getReleaseNoteProps(
    locale,
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

export async function getSolution(locale: string, solutionSlug?: string) {
  const props = manageUndefined(
    (await getSolutionsProps(locale)).find(({ slug }) => slug === solutionSlug)
  );
  return props;
}

export async function getSolutionListPage(locale: string) {
  const solutionListPageProps = await getSolutionListPageProps(locale);
  return manageUndefined(solutionListPageProps);
}

export async function getSolutionDetail(
  solutionSlug: string,
  locale: string,
  solutionSubPathSlugs: readonly string[]
) {
  const solutionData = await getSolution(locale, solutionSlug);
  if (!solutionData) {
    // eslint-disable-next-line functional/no-throw-statements
    throw new Error('Failed to fetch solution data');
  }
  const solutionsMetadata = await getSolutionsMetadata(
    locale,
    solutionData.dirName
  );

  return await getSolutionProps(
    solutionSlug,
    locale,
    solutionsMetadata.find(
      ({ path }) =>
        path === `/solutions/${solutionSlug}/${solutionSubPathSlugs.join('/')}`
    )
  );
}

export async function getUseCase(
  locale: string,
  productSlug: string,
  productUseCasePage?: ReadonlyArray<string>
) {
  const useCaseSubPath = productUseCasePage?.join('/');
  const useCasePath = `${locale}/${productSlug}/use-cases/${useCaseSubPath}`;

  const product = await getProduct(locale, productSlug);

  const props = manageUndefined(
    (await getUseCasesProps(locale)).find(({ path }) => path === useCasePath)
  );
  return {
    ...props,
    product,
  };
}

export async function getUseCaseListPageProps(
  locale: string,
  productSlug?: string
) {
  const useCaseListPages = await getUseCaseListPagesProps(locale);
  const props =
    useCaseListPages.find(({ product }) => product.slug === productSlug) ||
    null;

  return manageUndefinedAndAddProducts(locale, props);
}

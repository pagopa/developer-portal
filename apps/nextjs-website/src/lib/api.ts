import { ApiDataListPagesRepository } from '@/lib/apiDataListPages';
import { CaseHistoriesRepository } from '@/lib/caseHistories';
import { GuideListPagesRepository } from '@/lib/guideListPages';
import { GuidesRepository } from '@/lib/guides';
import { Product } from '@/lib/products/types';
import { QuickStartGuidesRepository } from '@/lib/quickStartGuides';
import { SolutionRepository } from '@/lib/solutions';
import { SolutionListPageRepository } from '@/lib/solutionListPage';
import { TutorialRepository } from '@/lib/tutorials';
import { TutorialListPageRepository } from '@/lib/tutorialListPage';
import { UseCasesRepository } from '@/lib/useCases';
import { UseCaseListPageRepository } from '@/lib/useCaseListPage';
import { WebinarsRepository } from '@/lib/webinars';
import { WebinarCategoriesRepository } from '@/lib/webinarCategories';
import { TagsRepository } from '@/lib/tags';
import { UrlReplaceMapRepository } from '@/lib/urlReplaceMap';
import { ReleaseNotesRepository } from '@/lib/releaseNotes';
import { Webinar } from '@/lib/webinars/types';
import { parseS3GuidePage } from '@/helpers/parseS3Doc.helpers';
import {
  getGuidesMetadata,
  getReleaseNotesMetadata,
  getSolutionsMetadata,
} from '@/helpers/s3Metadata.helpers';
import { OverviewsRepository } from './overviews';
import { ProductRepository } from './products';
import { makeReleaseNote, makeSolution } from '../helpers/makeS3Docs.helpers';

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

export async function getGuidePage(
  guidePaths: ReadonlyArray<string>,
  locale: string,
  productSlug: string
) {
  // Fetch data in parallel instead of sequential
  const [products, guideResult] = await Promise.all([
    getProducts(locale),
    GuidesRepository.getByProductAndSlug(
      locale,
      productSlug,
      guidePaths.length > 0 ? guidePaths[0] : ''
    ),
  ]);
  const guideProps = manageUndefined(guideResult);

  // Path construction
  const guidePath = [
    `/${locale}`,
    guideProps.product.slug,
    'guides',
    ...guidePaths,
  ].join('/');
  const versionCheck = guidePaths.length > 1 ? guidePaths[1] : null;
  const guideToFind = guideProps.versions.find((v) => {
    return versionCheck ? v.version === versionCheck : v.main;
  });

  const guidesMetadata = await getGuidesMetadata(
    locale,
    guideToFind ? guideToFind.dirName : ''
  );
  return manageUndefined(
    await parseS3GuidePage({
      guideProps,
      guidePath,
      guidesMetadata,
      products,
      locale,
    })
  );
}

export async function getGuideListPages(locale: string, productSlug?: string) {
  const props = manageUndefined(
    await GuideListPagesRepository.getByProductSlug(locale, productSlug || '')
  );
  return manageUndefinedAndAddProducts(locale, props);
}

export async function getOverview(locale: string, productSlug?: string) {
  return manageUndefined(
    (await OverviewsRepository.getAll(locale)).find(
      (overviewData) => overviewData.product.slug === productSlug
    )
  );
}

export async function getProducts(locale: string): Promise<readonly Product[]> {
  return await ProductRepository.getAll(locale);
}

export async function getQuickStartGuide(locale: string, productSlug?: string) {
  const props = manageUndefined(
    await QuickStartGuidesRepository.getByProductSlug(locale, productSlug || '')
  );
  return manageUndefinedAndAddProducts(locale, props);
}

export async function getTutorial(
  locale: string,
  productSlug: string,
  productTutorialPage?: ReadonlyArray<string>
) {
  const tutorialSubPath = productTutorialPage?.join('/');
  const tutorialPath = `/${locale}/${productSlug}/tutorials/${tutorialSubPath}`;

  const product = await getProduct(locale, productSlug);

  const props = manageUndefined(
    await TutorialRepository.getByPath(locale, tutorialPath)
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
    await TutorialListPageRepository.getByProductSlug(locale, productSlug || '')
  );
  return manageUndefinedAndAddProducts(locale, tutorialListPages);
}

export async function getVisibleInListWebinars(
  locale: string
): Promise<readonly Webinar[]> {
  return (await WebinarsRepository.getAll(locale)).filter(
    (webinar) => webinar.isVisibleInList
  );
}

export async function getWebinar(
  locale: string,
  webinarSlug?: string
): Promise<Webinar> {
  const props = manageUndefined(
    await WebinarsRepository.getBySlug(locale, webinarSlug || '')
  );
  return props;
}

export async function getWebinars(locale: string): Promise<readonly Webinar[]> {
  return WebinarsRepository.getAll(locale);
}

export async function getWebinarCategories(locale: string) {
  return WebinarCategoriesRepository.getAll(locale);
}

export async function getTags(locale: string) {
  return TagsRepository.getAll(locale);
}

export async function getUrlReplaceMap(locale: string) {
  return UrlReplaceMapRepository.get(locale);
}

export async function getReleaseNotes(locale: string) {
  return ReleaseNotesRepository.getAll(locale);
}

export async function getCaseHistory(locale: string, caseHistorySlug?: string) {
  return manageUndefined(
    (await CaseHistoriesRepository.getAll(locale)).find(
      ({ slug }: { readonly slug: string }) => slug === caseHistorySlug
    )
  );
}

export async function getApiDataParams(locale: string) {
  const props = (await ApiDataListPagesRepository.getAll(locale)).flatMap(
    (apiDataListPageProps) =>
      apiDataListPageProps.apiDetailSlugs.map((apiDataSlug) => ({
        productSlug: apiDataListPageProps.product.slug,
        apiDataSlug,
        updatedAt: apiDataListPageProps.updatedAt,
      }))
  );

  return props || [];
}

export async function getProduct(locale: string, productSlug: string) {
  const props = (await ProductRepository.getAll(locale)).find(
    (product) => product.slug === productSlug
  );
  return props;
}

export async function getReleaseNote(
  locale: string,
  productSlug: string,
  releaseNoteSubPathSlugs?: readonly string[]
) {
  const products = await getProducts(locale);
  const releaseNotesPath = `/${locale}/${productSlug}/${releaseNoteSubPathSlugs?.join(
    '/'
  )}`;

  const releaseNote = await ReleaseNotesRepository.getByProductSlug(
    locale,
    productSlug
  );
  if (!releaseNote) {
    // eslint-disable-next-line functional/no-throw-statements
    throw new Error('Failed to fetch release notes data');
  }

  const releaseNotesMetadata = await getReleaseNotesMetadata(
    locale,
    releaseNote.dirName
  );

  const releaseNoteProps = await makeReleaseNote(
    releaseNote,
    locale,
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
    solutionSlug
      ? await SolutionRepository.getBySlug(locale, solutionSlug)
      : undefined
  );
  return props;
}

export async function getSolutionListPage(locale: string) {
  const solutionListPageProps = await SolutionListPageRepository.get(locale);
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

  const solution = await SolutionRepository.getBySlug(solutionSlug, locale);

  if (!solution) {
    // eslint-disable-next-line functional/no-throw-statements
    throw new Error(`No solution found matching slug "${solutionSlug}"`);
  }

  return makeSolution(
    solution,
    locale,
    solutionsMetadata.find(
      ({ path }) =>
        path ===
        `/${locale}/solutions/${solutionSlug}/${solutionSubPathSlugs.join('/')}`
    )
  );
}

export async function getUseCase(
  locale: string,
  productSlug: string,
  productUseCasePage?: ReadonlyArray<string>
) {
  const useCaseSubPath = productUseCasePage?.join('/');
  const useCasePath = `/${locale}/${productSlug}/use-cases/${useCaseSubPath}`;

  const product = await getProduct(locale, productSlug);

  const props = manageUndefined(
    await UseCasesRepository.getByPath(locale, useCasePath)
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
  const props = await UseCaseListPageRepository.getByProductSlug(
    locale,
    productSlug || ''
  );

  return manageUndefinedAndAddProducts(locale, props);
}

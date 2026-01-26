import { pipe } from 'fp-ts/lib/function';
import * as E from 'fp-ts/lib/Either';
import { makeBuildConfig } from '@/BuildConfig';
import { makeBuildEnv } from '@/BuildEnv';
import { makeHomepageProps } from './strapi/makeProps/makeHomepage';
import { fetchHomepage } from '@/lib/strapi/fetches/fetchHomepage';
import { makeWebinarsProps } from './strapi/makeProps/makeWebinars';
import { fetchWebinars } from './strapi/fetches/fetchWebinars';
import { fetchTutorials } from './strapi/fetches/fetchTutorials';
import { makeTutorialsProps } from './strapi/makeProps/makeTutorials';
import { fetchQuickStartGuides } from './strapi/fetches/fetchQuickStartGuides';
import { makeQuickStartGuidesProps } from './strapi/makeProps/makeQuickStartGuides';
import { makeCaseHistoriesProps } from './strapi/makeProps/makeCaseHistories';
import { fetchCaseHistories } from './strapi/fetches/fetchCaseHistories';
import { makeSolutionsProps } from './strapi/makeProps/makeSolutions';
import { makeSolutionListPageProps } from './strapi/makeProps/makeSolutionListPage';
import { fetchSolutionListPage } from './strapi/fetches/fetchSolutionListPage';
import { fetchApiDataListPages } from './strapi/fetches/fetchApiDataListPages';
import { makeApiDataListPagesProps } from './strapi/makeProps/makeApiDataListPages';
import { makeApiDataListProps } from './strapi/makeProps/makeApiDataList';
import { fetchApiDataList } from './strapi/fetches/fetchApiDataList';
import { fetchProducts } from '@/lib/strapi/fetches/fetchProducts';
import { makeProductsProps } from './strapi/makeProps/makeProducts';
import { makeGuideListPagesProps } from './strapi/makeProps/makeGuideListPages';
import { makeGuidesProps } from './strapi/makeProps/makeGuides';
import { fetchOverviews } from '@/lib/strapi/fetches/fetchOverviews';
import { makeOverviewsProps } from '@/lib/strapi/makeProps/makeOverviews';
import { fetchTutorialListPages } from './strapi/fetches/fetchTutorialListPages';
import { makeTutorialListPagesProps } from './strapi/makeProps/makeTutorialListPages';
import { fetchUrlReplaceMap } from './strapi/fetches/fetchUrlReplaceMap';
import { makeUrlReplaceMap } from './strapi/makeProps/makeUrlReplaceMap';
import { makeReleaseNotesProps } from '@/lib/strapi/makeProps/makeReleaseNotes';
import {
  makeGuide as makeGuideS3,
  makeSolution as makeSolutionS3,
  makeReleaseNote as makeReleaseNoteS3,
} from '@/helpers/makeS3Docs.helpers';
import { secrets } from '@/config';
import { fetchWebinarCategories } from '@/lib/strapi/fetches/fetchWebinarCategories';
import { makeWebinarCategoriesProps } from '@/lib/strapi/makeProps/makeWebinarCategories';
import {
  fetchResponseFromCDN,
  JsonMetadata,
} from '@/helpers/s3Metadata.helpers';
import { StrapiGuides } from '@/lib/strapi/types/guide';
import { fetchUseCases } from '@/lib/strapi/fetches/fetchUseCases';
import { makeUseCasesProps } from '@/lib/strapi/makeProps/makeUseCases';
import { fetchUseCaseListPages } from '@/lib/strapi/fetches/fetchUseCaseListPages';
import { makeUseCaseListPagesProps } from '@/lib/strapi/makeProps/makeUseCaseListPages';
import { fetchTags } from '@/lib/strapi/fetches/fetchTags';
import { makeTagsProps } from '@/lib/strapi/makeProps/makeTags';
import { isMarkDownPart, MarkDownPart } from '@/lib/strapi/types/part';
import { getMarkdownContent } from '@/lib/api';
import { fetchGuideListPages } from './strapi/fetches/fetchGuideListPages';
import {
  getSyncedGuidesResponseJsonPath,
  getSyncedSolutionsResponseJsonPath,
  getSyncedReleaseNotesResponseJsonPath,
} from 'gitbook-docs/syncedResponses';
import { StrapiSolutions } from './strapi/types/solutions';
import { StrapiReleaseNotes } from './strapi/types/releaseNotes';

// a BuildEnv instance ready to be used
const buildEnv = pipe(
  makeBuildConfig(Object.keys(secrets).length > 0 ? secrets : process.env),
  E.map(makeBuildEnv),
  E.getOrElseW((errors) => {
    // eslint-disable-next-line functional/no-throw-statements
    throw errors;
  })
);

export const getHomepageProps = async () => {
  const strapiHomepage = await fetchHomepage(buildEnv);
  return makeHomepageProps(strapiHomepage);
};

export const getWebinarsProps = async () => {
  const strapiWebinars = await fetchWebinars(buildEnv);
  return makeWebinarsProps(strapiWebinars);
};

export const getProductsProps = async () => {
  const strapiProducts = await fetchProducts(buildEnv);
  const products = makeProductsProps(strapiProducts);
  return [...products].sort((productA, productB) =>
    productA.name.localeCompare(productB.name)
  );
};

export const getWebinarCategoriesProps = async () => {
  const strapiWebinarCategories = await fetchWebinarCategories(buildEnv);
  return makeWebinarCategoriesProps(strapiWebinarCategories);
};

export const getTagsProps = async () => {
  const strapiTags = await fetchTags(buildEnv);
  return makeTagsProps(strapiTags);
};

export const getTutorialsProps = async () => {
  const strapiTutorials = await fetchTutorials(buildEnv);
  const tutorialsWithMarkdown = strapiTutorials.data.filter((tutorial) => {
    const parts = tutorial?.parts ?? [];
    return parts.some((part) => part?.__component === 'parts.markdown');
  });
  const allMarkdownParts = tutorialsWithMarkdown.flatMap((tutorial) =>
    (tutorial?.parts ?? []).filter(
      (part) => part?.__component === 'parts.markdown'
    )
  );
  const contentPromises = allMarkdownParts.map(async (part) => {
    const { dirName, pathToFile } = part as MarkDownPart;
    const key = `${dirName}/${pathToFile}`;
    const content = await getMarkdownContent(dirName, pathToFile);
    return [key, content];
  });
  const resolvedContentPairs = await Promise.all(contentPromises);
  const markdownContentDict = Object.fromEntries(resolvedContentPairs);
  return makeTutorialsProps(strapiTutorials, markdownContentDict);
};

export const getTutorialListPagesProps = async () => {
  const strapiTutorialListPages = await fetchTutorialListPages(buildEnv);
  return makeTutorialListPagesProps(strapiTutorialListPages);
};

export const getQuickStartGuidesProps = async () => {
  const strapiQuickStartGuides = await fetchQuickStartGuides(buildEnv);
  return makeQuickStartGuidesProps(strapiQuickStartGuides);
};

export const getUrlReplaceMapProps = async () => {
  const strapiUrlReplaceMap = await fetchUrlReplaceMap(buildEnv);
  return makeUrlReplaceMap(strapiUrlReplaceMap);
};

export const getApiDataListPagesProps = async () => {
  const strapiApiDataListPages = await fetchApiDataListPages(buildEnv);
  return makeApiDataListPagesProps(strapiApiDataListPages);
};

export const getApiDataProps = async () => {
  const strapiApiDataList = await fetchApiDataList(buildEnv);
  return await makeApiDataListProps(strapiApiDataList);
};

export const getCaseHistoriesProps = async () => {
  const strapiCaseHistories = await fetchCaseHistories(buildEnv);
  return makeCaseHistoriesProps(strapiCaseHistories);
};

export const getSolutionsProps = async () => {
  const strapiSolutions = (await fetchResponseFromCDN(
    getSyncedSolutionsResponseJsonPath()
  )) as StrapiSolutions | undefined;
  return strapiSolutions ? makeSolutionsProps(strapiSolutions) : [];
};

export const getSolutionListPageProps = async () => {
  const strapiSolutionListPage = await fetchSolutionListPage(buildEnv);
  return makeSolutionListPageProps(strapiSolutionListPage);
};

export const getOverviewsProps = async () => {
  const strapiOverviews = await fetchOverviews(buildEnv);
  return makeOverviewsProps(strapiOverviews);
};

export const getGuideListPagesProps = async () => {
  const strapiGuideList = await fetchGuideListPages(buildEnv);
  return strapiGuideList ? makeGuideListPagesProps(strapiGuideList) : [];
};

export const getGuideProps = async (
  guidePaths: ReadonlyArray<string>,
  productSlug: string
) => {
  const guide = await getGuidePageProps(guidePaths[0], productSlug);
  return await makeGuideS3({ guideDefinition: guide, guidePaths });
};

export const getGuidePageProps = async (
  guideSlug: string,
  productSlug: string
) => {
  const strapiGuides = (await fetchResponseFromCDN(
    getSyncedGuidesResponseJsonPath()
  )) as StrapiGuides | undefined;

  const guides = strapiGuides ? makeGuidesProps(strapiGuides) : [];
  const guide = guides.filter(
    (g) => g.guide.slug === guideSlug && g.product.slug === productSlug
  )[0];

  if (!guide) {
    // eslint-disable-next-line functional/no-throw-statements
    throw new Error('Failed to fetch guide data');
  }

  return guide;
};

export const getSolutionProps = async (
  solutionsSlug: string,
  jsonMetadata?: JsonMetadata
) => {
  const strapiSolutions = (await fetchResponseFromCDN(
    getSyncedSolutionsResponseJsonPath()
  )) as StrapiSolutions | undefined;
  if (!strapiSolutions || strapiSolutions.data.length < 1) {
    // eslint-disable-next-line functional/no-throw-statements
    throw new Error('Failed to fetch solution data');
  }
  const solutions = makeSolutionsProps(strapiSolutions);
  const solution = solutions.find((s) => s.slug === solutionsSlug);
  if (!solution) {
    // eslint-disable-next-line functional/no-throw-statements
    throw new Error(`No solution found matching slug "${solutionsSlug}"`);
  }
  return await makeSolutionS3(solution, jsonMetadata);
};

const fetchReleaseNotes = async () => {
  const strapiReleaseNotes = (await fetchResponseFromCDN(
    getSyncedReleaseNotesResponseJsonPath()
  )) as StrapiReleaseNotes | undefined;
  if (!strapiReleaseNotes || strapiReleaseNotes.data.length < 1) {
    // eslint-disable-next-line functional/no-throw-statements
    throw new Error('Failed to fetch release data');
  }
  return strapiReleaseNotes;
};

export const getStrapiReleaseNotes = async (productSlug: string) => {
  const strapiReleaseNotes = await fetchReleaseNotes();
  return strapiReleaseNotes.data.find(
    (strapiReleaseNote) => strapiReleaseNote.product?.slug === productSlug
  );
};

export const getReleaseNoteProps = async (
  productSlug: string,
  jsonMetadata?: JsonMetadata
) => {
  const strapiReleaseNotes = await fetchReleaseNotes();
  const releaseNotes = makeReleaseNotesProps(strapiReleaseNotes);
  const releaseNote = releaseNotes.find(
    (rn) => rn.product.slug === productSlug
  );
  if (!releaseNote) {
    // eslint-disable-next-line functional/no-throw-statements
    throw new Error(
      `No release data found matching product slug "${productSlug}"`
    );
  }
  return await makeReleaseNoteS3(releaseNote, jsonMetadata);
};

export const getUseCasesProps = async () => {
  const strapiUseCases = await fetchUseCases(buildEnv);
  const allMarkdownParts = strapiUseCases.data.flatMap((useCase) =>
    (useCase?.parts ?? []).filter(isMarkDownPart)
  );
  const contentPromises = allMarkdownParts.map(async (part) => {
    const { dirName, pathToFile } = part;
    const key = `${dirName}/${pathToFile}`;
    const content = await getMarkdownContent(dirName, pathToFile);
    return [key, content];
  });
  const resolvedContentPairs = await Promise.all(contentPromises);
  const markdownContentDict = Object.fromEntries(resolvedContentPairs);
  return makeUseCasesProps(strapiUseCases, markdownContentDict);
};

export const getUseCaseListPagesProps = async () => {
  const strapiUseCasesListPages = await fetchUseCaseListPages(buildEnv);
  return makeUseCaseListPagesProps(strapiUseCasesListPages);
};

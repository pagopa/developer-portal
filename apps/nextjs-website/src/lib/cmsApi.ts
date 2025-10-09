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
import { fetchSolution, fetchSolutions } from './strapi/fetches/fetchSolutions';
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
import { fetchReleaseNote } from '@/lib/strapi/fetches/fetchReleaseNotes';
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
import { StrapiGuideListPages } from '@/lib/strapi/types/guideListPage';
import { StrapiGuides } from '@/lib/strapi/types/guide';
import { fetchUseCases } from '@/lib/strapi/fetches/fetchUseCases';
import { makeUseCasesProps } from '@/lib/strapi/makeProps/makeUseCases';
import { fetchUseCaseListPages } from '@/lib/strapi/fetches/fetchUseCaseListPages';
import { makeUseCaseListPagesProps } from '@/lib/strapi/makeProps/makeUseCaseListPages';
import { fetchTags } from '@/lib/strapi/fetches/fetchTags';
import { makeTagsProps } from '@/lib/strapi/makeProps/makeTags';
import { cons } from 'fp-ts/lib/ReadonlyNonEmptyArray';

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
  return makeProductsProps(strapiProducts);
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
  return makeTutorialsProps(strapiTutorials);
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
  const processed = makeUrlReplaceMap(strapiUrlReplaceMap);
  return processed;
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
  const strapiSolutions = await fetchSolutions(buildEnv);
  return makeSolutionsProps(strapiSolutions);
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
  const strapiGuideList = (await fetchResponseFromCDN(
    'synced-guide-list-pages-response.json'
  )) as StrapiGuideListPages | undefined;
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
  // TODO: restore this when Strapi will manage guides metadata
  const strapiGuides = (await fetchResponseFromCDN(
    'synced-guides-response.json'
  )) as StrapiGuides | undefined;
  // eslint-disable-next-line functional/no-expression-statements
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
  const strapiSolutions = await fetchSolution(solutionsSlug)(buildEnv);
  if (!strapiSolutions || strapiSolutions.data.length < 1) {
    // eslint-disable-next-line functional/no-throw-statements
    throw new Error('Failed to fetch data');
  }
  const solution = makeSolutionsProps(strapiSolutions)[0];
  return await makeSolutionS3(solution, jsonMetadata);
};

export const getReleaseNoteProps = async (
  productSlug: string,
  jsonMetadata?: JsonMetadata
) => {
  const strapiReleaseNotes = await fetchReleaseNote(productSlug)(buildEnv);
  if (!strapiReleaseNotes || strapiReleaseNotes.data.length < 1) {
    // eslint-disable-next-line functional/no-throw-statements
    throw new Error('Failed to fetch data');
  }
  const releaseNote = makeReleaseNotesProps(strapiReleaseNotes)[0];
  return await makeReleaseNoteS3(releaseNote, jsonMetadata);
};

export const getUseCasesProps = async () => {
  const strapiUseCases = await fetchUseCases(buildEnv);
  return makeUseCasesProps(strapiUseCases);
};

export const getUseCaseListPagesProps = async () => {
  const strapiUseCasesListPages = await fetchUseCaseListPages(buildEnv);
  return makeUseCaseListPagesProps(strapiUseCasesListPages);
};

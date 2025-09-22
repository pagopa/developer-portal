import { pipe } from 'fp-ts/lib/function';
import * as E from 'fp-ts/lib/Either';
import { makeBuildConfig } from '@/BuildConfig';
import { makeBuildEnv } from '@/BuildEnv';
import { makeHomepageProps } from './strapi/makeData/makeHomepage';
import { fetchHomepage } from '@/lib/strapi/fetches/fetchHomepage';
import { makeWebinarsProps } from './strapi/makeData/makeWebinars';
import { fetchWebinars } from './strapi/fetches/fetchWebinars';
import { fetchTutorials } from './strapi/fetches/fetchTutorials';
import { makeTutorials } from './strapi/makeData/makeTutorials';
import { fetchQuickStartGuides } from './strapi/fetches/fetchQuickStartGuides';
import { makeQuickStartGuides } from './strapi/makeData/makeQuickStartGuides';
import { makeCaseHistories } from './strapi/makeData/makeCaseHistories';
import { fetchCaseHistories } from './strapi/fetches/fetchCaseHistories';
import { fetchSolution, fetchSolutions } from './strapi/fetches/fetchSolutions';
import { makeSolutions } from './strapi/makeData/makeSolutions';
import { makeSolutionListPageProps } from './strapi/makeData/makeSolutionListPage';
import { fetchSolutionListPage } from './strapi/fetches/fetchSolutionListPage';
import { fetchApiDataListPages } from './strapi/fetches/fetchApiDataListPages';
import { makeApiDataListPages } from './strapi/makeData/makeApiDataListPages';
import { makeApiDataList } from './strapi/makeData/makeApiDataList';
import { fetchApiDataList } from './strapi/fetches/fetchApiDataList';
import { fetchProducts } from '@/lib/strapi/fetches/fetchProducts';
import { makeProductsProps } from './strapi/makeData/makeProducts';
import { makeGuideListPages } from './strapi/makeData/makeGuideListPages';
import { makeGuides } from './strapi/makeData/makeGuides';
import { fetchOverviews } from '@/lib/strapi/fetches/fetchOverviews';
import { makeOverviews } from '@/lib/strapi/makeData/makeOverviews';
import { fetchTutorialListPages } from './strapi/fetches/fetchTutorialListPages';
import { makeTutorialListPagesProps } from './strapi/makeData/makeTutorialListPages';
import { fetchUrlReplaceMap } from './strapi/fetches/fetchUrlReplaceMap';
import { makeUrlReplaceMap } from './strapi/makeData/makeUrlReplaceMap';
import { makeReleaseNotes } from '@/lib/strapi/makeData/makeReleaseNotes';
import { fetchReleaseNote } from '@/lib/strapi/fetches/fetchReleaseNotes';
import {
  makeGuide as makeGuideS3,
  makeSolution as makeSolutionS3,
  makeReleaseNote as makeReleaseNoteS3,
} from '@/helpers/makeS3Docs.helpers';
import { secrets } from '@/config';
import { fetchWebinarCategories } from '@/lib/strapi/fetches/fetchWebinarCategories';
import { makeWebinarCategories } from '@/lib/strapi/makeData/makeWebinarCategories';
import {
  fetchResponseFromCDN,
  JsonMetadata,
} from '@/helpers/s3Metadata.helpers';
import { StrapiGuideListPages } from '@/lib/strapi/types/guideListPage';
import { StrapiGuides } from '@/lib/strapi/types/guide';

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
  return makeWebinarCategories(strapiWebinarCategories);
};

export const getTutorialsProps = async () => {
  const strapiTutorials = await fetchTutorials(buildEnv);
  return makeTutorials(strapiTutorials);
};

export const getTutorialListPagesProps = async () => {
  const strapiTutorialListPages = await fetchTutorialListPages(buildEnv);
  return makeTutorialListPagesProps(strapiTutorialListPages);
};

export const getQuickStartGuidesProps = async () => {
  const strapiQuickStartGuides = await fetchQuickStartGuides(buildEnv);
  return makeQuickStartGuides(strapiQuickStartGuides);
};

export const getUrlReplaceMapProps = async () => {
  const strapiUrlReplaceMap = await fetchUrlReplaceMap(buildEnv);
  const processed = makeUrlReplaceMap(strapiUrlReplaceMap);
  return processed;
};

export const getApiDataListPagesProps = async () => {
  const strapiApiDataListPages = await fetchApiDataListPages(buildEnv);
  return makeApiDataListPages(strapiApiDataListPages);
};

export const getApiDataProps = async () => {
  const strapiApiDataList = await fetchApiDataList(buildEnv);
  return await makeApiDataList(strapiApiDataList);
};

export const getCaseHistoriesProps = async () => {
  const strapiCaseHistories = await fetchCaseHistories(buildEnv);
  return makeCaseHistories(strapiCaseHistories);
};

export const getSolutionsProps = async () => {
  const strapiSolutions = await fetchSolutions(buildEnv);
  return makeSolutions(strapiSolutions);
};

export const getSolutionListPageProps = async () => {
  const strapiSolutionListPage = await fetchSolutionListPage(buildEnv);
  return makeSolutionListPageProps(strapiSolutionListPage);
};

export const getOverviewsProps = async () => {
  const strapiOverviews = await fetchOverviews(buildEnv);
  return makeOverviews(strapiOverviews);
};

export const getGuideListPagesProps = async () => {
  const strapiGuideList = (await fetchResponseFromCDN(
    'synced-guide-list-pages-response.json'
  )) as StrapiGuideListPages | undefined;
  return strapiGuideList ? makeGuideListPages(strapiGuideList) : [];
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
  const guides = strapiGuides ? makeGuides(strapiGuides) : [];
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
  const solution = makeSolutions(strapiSolutions)[0];
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
  const releaseNote = makeReleaseNotes(strapiReleaseNotes)[0];
  return await makeReleaseNoteS3(releaseNote, jsonMetadata);
};

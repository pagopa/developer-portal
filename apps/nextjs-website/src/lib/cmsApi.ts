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
import { fetchSolutions } from './strapi/fetches/fetchSolutions';
import { makeSolutionsProps } from './strapi/makeProps/makeSolutions';
import { makeSolutionListPageProps } from './strapi/makeProps/makeSolutionListPage';
import { fetchSolutionListPage } from './strapi/fetches/fetchSolutionListPage';
import { fetchApiDataListPages } from './strapi/fetches/fetchApiDataListPages';
import { makeApiDataListPagesProps } from './strapi/makeProps/makeApiDataListPages';
import { makeApiDataListProps } from './strapi/makeProps/makeApiDataList';
import { fetchApiDataList } from './strapi/fetches/fetchApiDataList';
import { fetchProducts } from '@/lib/strapi/fetches/fetchProducts';
import { makeProductsProps } from './strapi/makeProps/makeProducts';
import { fetchGuideListPages } from './strapi/fetches/fetchGuideListPages';
import { makeGuideListPagesProps } from './strapi/makeProps/makeGuideListPages';
import { fetchGuides } from './strapi/fetches/fetchGuides';
import { makeGuidesProps } from './strapi/makeProps/makeGuides';
import { makeGuide } from '@/helpers/makeDocs.helpers';
import { fetchOverviews } from '@/lib/strapi/fetches/fetchOverviews';
import { makeOverviewsProps } from '@/lib/strapi/makeProps/makeOverviews';
import { fetchTutorialListPages } from './strapi/fetches/fetchTutorialListPages';
import { makeTutorialListPagesProps } from './strapi/makeProps/makeTutorialListPages';
import { fetchUrlReplaceMap } from './strapi/fetches/fetchUrlReplaceMap';
import {
  makeUrlReplaceMap,
  UrlReplaceMap,
} from './strapi/makeProps/makeUrlReplaceMap';

// a BuildEnv instance ready to be used
const buildEnv = pipe(
  makeBuildConfig({...process.env, ...JSON.parse(process.env.secrets!)}),
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
  return makeUrlReplaceMap(strapiUrlReplaceMap);
};

// eslint-disable-next-line functional/no-let
let cachedUrlReplaceMapProps: UrlReplaceMap = {}; // We need to use any[] because of the type issue makeGuide derived type are not statically defined
// eslint-disable-next-line functional/no-let
let areUrlReplaceMapCached = false;

export const getCachedUrlReplaceMapProps = async () => {
  if (!areUrlReplaceMapCached) {
    // eslint-disable-next-line functional/no-expression-statements
    cachedUrlReplaceMapProps = await getUrlReplaceMapProps();
    // eslint-disable-next-line functional/no-expression-statements
    areUrlReplaceMapCached = true;
  }
  return cachedUrlReplaceMapProps;
};

export const getApiDataListPagesProps = async () => {
  const strapiApiDataListPages = await fetchApiDataListPages(buildEnv);
  return makeApiDataListPagesProps(strapiApiDataListPages);
};

export const getApiDataProps = async () => {
  const strapiApiDataList = await fetchApiDataList(buildEnv);
  return makeApiDataListProps(strapiApiDataList);
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
  const strapiGuideList = await fetchGuideListPages(buildEnv);
  return makeGuideListPagesProps(strapiGuideList);
};

// Due to not exported type from 'gitbook-docs/parseDoc' and problems with the derivative types,
// we had to manage cache with two dedicated variables
// eslint-disable-next-line
let cachedGuides: any[] = []; // We need to use any[] because of the type issue makeGuide derived type are not statically defined
// eslint-disable-next-line
let isCached: boolean = false;

export const getGuidesProps = async () => {
  if (!isCached) {
    // eslint-disable-next-line functional/no-expression-statements
    cachedGuides = await getGuidesPropsCache();
    // eslint-disable-next-line functional/no-expression-statements
    isCached = true;
  }
  return cachedGuides;
};

// TODO: Manage all fetched resources with cache in a dedicated helper function
export const getGuidesPropsCache = async () => {
  const strapiGuides = await fetchGuides(buildEnv);
  return makeGuidesProps(strapiGuides).flatMap(makeGuide);
};

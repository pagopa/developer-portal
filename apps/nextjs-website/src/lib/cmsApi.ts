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
import { withCache, getCacheKey } from './cache';

// a BuildEnv instance ready to be used
const buildEnv = pipe(
  makeBuildConfig(process.env),
  E.map(makeBuildEnv),
  E.getOrElseW((errors) => {
    // eslint-disable-next-line functional/no-throw-statements
    throw errors;
  })
);

export const getHomepageProps = async () => {
  return withCache(
    getCacheKey('getHomepageProps'),
    async () => {
      const strapiHomepage = await fetchHomepage(buildEnv);
      return makeHomepageProps(strapiHomepage);
    },
    900 // 15 minutes in seconds
  );
};

export const getWebinarsProps = async () => {
  return withCache(
    getCacheKey('getWebinarsProps'),
    async () => {
      const strapiWebinars = await fetchWebinars(buildEnv);
      return makeWebinarsProps(strapiWebinars);
    },
    900
  );
};

export const getProductsProps = async () => {
  return withCache(
    getCacheKey('getProductsProps'),
    async () => {
      const strapiProducts = await fetchProducts(buildEnv);
      return makeProductsProps(strapiProducts);
    },
    900
  );
};

export const getTutorialsProps = async () => {
  return withCache(
    getCacheKey('getTutorialsProps'),
    async () => {
      const strapiTutorials = await fetchTutorials(buildEnv);
      return makeTutorialsProps(strapiTutorials);
    },
    900
  );
};

export const getTutorialListPagesProps = async () => {
  return withCache(
    getCacheKey('getTutorialListPagesProps'),
    async () => {
      const strapiTutorialListPages = await fetchTutorialListPages(buildEnv);
      return makeTutorialListPagesProps(strapiTutorialListPages);
    },
    900
  );
};

export const getQuickStartGuidesProps = async () => {
  return withCache(
    getCacheKey('getQuickStartGuidesProps'),
    async () => {
      const strapiQuickStartGuides = await fetchQuickStartGuides(buildEnv);
      return makeQuickStartGuidesProps(strapiQuickStartGuides);
    },
    900
  );
};

export const getUrlReplaceMapProps = async () => {
  return withCache(
    getCacheKey('getUrlReplaceMapProps'),
    async () => {
      const strapiUrlReplaceMap = await fetchUrlReplaceMap(buildEnv);
      return makeUrlReplaceMap(strapiUrlReplaceMap);
    },
    900
  );
};

export const getApiDataListPagesProps = async () => {
  return withCache(
    getCacheKey('getApiDataListPagesProps'),
    async () => {
      const strapiApiDataListPages = await fetchApiDataListPages(buildEnv);
      return makeApiDataListPagesProps(strapiApiDataListPages);
    },
    900
  );
};

export const getApiDataProps = async () => {
  return withCache(
    getCacheKey('getApiDataProps'),
    async () => {
      const strapiApiDataList = await fetchApiDataList(buildEnv);
      return makeApiDataListProps(strapiApiDataList);
    },
    900
  );
};

export const getCaseHistoriesProps = async () => {
  return withCache(
    getCacheKey('getCaseHistoriesProps'),
    async () => {
      const strapiCaseHistories = await fetchCaseHistories(buildEnv);
      return makeCaseHistoriesProps(strapiCaseHistories);
    },
    900
  );
};

export const getSolutionsProps = async () => {
  return withCache(
    getCacheKey('getSolutionsProps'),
    async () => {
      const strapiSolutions = await fetchSolutions(buildEnv);
      return makeSolutionsProps(strapiSolutions);
    },
    900
  );
};

export const getSolutionListPageProps = async () => {
  return withCache(
    getCacheKey('getSolutionListPageProps'),
    async () => {
      const strapiSolutionListPage = await fetchSolutionListPage(buildEnv);
      return makeSolutionListPageProps(strapiSolutionListPage);
    },
    900
  );
};

export const getOverviewsProps = async () => {
  return withCache(
    getCacheKey('getOverviewsProps'),
    async () => {
      const strapiOverviews = await fetchOverviews(buildEnv);
      return makeOverviewsProps(strapiOverviews);
    },
    900
  );
};

export const getGuideListPagesProps = async () => {
  return withCache(
    getCacheKey('getGuideListPagesProps'),
    async () => {
      const strapiGuideList = await fetchGuideListPages(buildEnv);
      return makeGuideListPagesProps(strapiGuideList);
    },
    900
  );
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
  return withCache(
    getCacheKey('getGuidesPropsCache'),
    async () => {
      const strapiGuides = await fetchGuides(buildEnv);
      return makeGuidesProps(strapiGuides).flatMap(makeGuide);
    },
    900
  );
};

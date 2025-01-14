import { pipe } from 'fp-ts/lib/function';
import * as E from 'fp-ts/lib/Either';
import { makeBuildConfig } from '@/BuildConfig';
import { makeBuildEnv } from '@/BuildEnv';
import {
  makeHomepageProps,
  makeHomepagePropsFromStatic,
} from './strapi/makeProps/makeHomepage';
import { fetchHomepage } from '@/lib/strapi/fetches/fetchHomepage';
import { translations } from '@/_contents/translations';
import { makeWebinarsProps } from './strapi/makeProps/makeWebinars';
import { fetchWebinars } from './strapi/fetches/fetchWebinars';
import { fetchTutorials } from './strapi/fetches/fetchTutorials';
import { makeTutorialsProps } from './strapi/makeProps/makeTutorials';
import { fetchQuickStartGuides } from './strapi/fetches/fetchQuickStartGuides';
import {
  makeQuickStartGuidesProps,
  makeQuickStartGuidesPropsFromStatic,
} from './strapi/makeProps/makeQuickStartGuides';
import {
  guideLists,
  guides,
  guidesDefinitions,
  overviews,
  products,
  quickStartGuides,
  staticUrlReplaceMap,
  tutorialLists,
} from '@/_contents/products';
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
import { makeGuide } from '@/_contents/makeDocs';
import { fetchOverviews } from '@/lib/strapi/fetches/fetchOverviews';
import { makeOverviewsProps } from '@/lib/strapi/makeProps/makeOverviews';
import { fetchTutorialListPages } from './strapi/fetches/fetchTutorialListPages';
import { makeTutorialListPagesProps } from './strapi/makeProps/makeTutorialListPages';
import { fetchUrlReplaceMap } from './strapi/fetches/fetchUrlReplaceMap';
import build from 'next/dist/build';
import { makeUrlReplaceMap } from './strapi/makeProps/makeUrlReplaceMap';

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
  const {
    config: { FETCH_FROM_STRAPI: fetchFromStrapi },
  } = buildEnv;

  const { homepage: staticHomepage } = translations;

  if (fetchFromStrapi) {
    const strapiHomepage = await fetchHomepage(buildEnv);
    return makeHomepageProps(strapiHomepage, staticHomepage);
  } else {
    return makeHomepagePropsFromStatic(staticHomepage);
  }
};

export const getWebinarsProps = async () => {
  const {
    config: { FETCH_FROM_STRAPI: fetchFromStrapi },
  } = buildEnv;

  if (fetchFromStrapi) {
    const strapiWebinars = await fetchWebinars(buildEnv);
    return makeWebinarsProps(strapiWebinars);
  } else {
    return [];
  }
};

export const getProductsProps = async () => {
  const {
    config: { FETCH_FROM_STRAPI: fetchFromStrapi },
  } = buildEnv;

  if (fetchFromStrapi) {
    const strapiProducts = await fetchProducts(buildEnv);
    return makeProductsProps(strapiProducts, products);
  } else return products;
};

export const getTutorialsProps = async (productSlug?: string) => {
  const {
    config: { FETCH_FROM_STRAPI: fetchFromStrapi },
  } = buildEnv;

  if (fetchFromStrapi) {
    const strapiTutorials = await fetchTutorials(buildEnv);
    return makeTutorialsProps(strapiTutorials, productSlug);
  } else {
    return [];
  }
};

export const getTutorialListPagesProps = async () => {
  const {
    config: { FETCH_FROM_STRAPI: fetchFromStrapi },
  } = buildEnv;

  if (fetchFromStrapi) {
    const strapiTutorialListPages = await fetchTutorialListPages(buildEnv);
    return makeTutorialListPagesProps(strapiTutorialListPages, tutorialLists);
  } else {
    return tutorialLists;
  }
};

export const getQuickStartGuidesProps = async () => {
  const {
    config: { FETCH_FROM_STRAPI: fetchFromStrapi },
  } = buildEnv;

  if (fetchFromStrapi) {
    const strapiQuickStart = await fetchQuickStartGuides(buildEnv);
    return makeQuickStartGuidesProps(strapiQuickStart, quickStartGuides);
  } else {
    return makeQuickStartGuidesPropsFromStatic(quickStartGuides);
  }
};

export const getUrlReplaceMapProps = async () => {
  const {
    config: { FETCH_FROM_STRAPI: fetchFromStrapi },
  } = buildEnv;

  if (fetchFromStrapi) {
    const urlReplaceMap = await fetchUrlReplaceMap(buildEnv);
    return { ...staticUrlReplaceMap, ...makeUrlReplaceMap(urlReplaceMap) };
  }
  return staticUrlReplaceMap;
};

export const getApiDataListPagesProps = async () => {
  const {
    config: { FETCH_FROM_STRAPI: fetchFromStrapi },
  } = buildEnv;

  if (fetchFromStrapi) {
    const apiDataListPages = await fetchApiDataListPages(buildEnv);
    return makeApiDataListPagesProps(apiDataListPages);
  } else return [];
};

export const getApiDataProps = async () => {
  const {
    config: { FETCH_FROM_STRAPI: fetchFromStrapi },
  } = buildEnv;

  if (fetchFromStrapi) {
    const apiDataList = await fetchApiDataList(buildEnv);
    return makeApiDataListProps(apiDataList);
  } else return [];
};

export const getCaseHistoriesProps = async () => {
  const {
    config: { FETCH_FROM_STRAPI: fetchFromStrapi },
  } = buildEnv;

  if (fetchFromStrapi) {
    const strapiCaseHistories = await fetchCaseHistories(buildEnv);
    return makeCaseHistoriesProps(strapiCaseHistories);
  } else {
    return [];
  }
};

export const getSolutionsProps = async () => {
  const {
    config: { FETCH_FROM_STRAPI: fetchFromStrapi },
  } = buildEnv;

  if (fetchFromStrapi) {
    const strapiSolutions = await fetchSolutions(buildEnv);
    return makeSolutionsProps(strapiSolutions);
  } else {
    return [];
  }
};

export const getSolutionListPageProps = async () => {
  const {
    config: { FETCH_FROM_STRAPI: fetchFromStrapi },
  } = buildEnv;

  if (fetchFromStrapi) {
    const strapiSolutionListPage = await fetchSolutionListPage(buildEnv);
    return makeSolutionListPageProps(strapiSolutionListPage);
  }
};

export const getOverviewsProps = async () => {
  const {
    config: { FETCH_FROM_STRAPI: fetchFromStrapi },
  } = buildEnv;

  if (fetchFromStrapi) {
    const strapiOverviews = await fetchOverviews(buildEnv);
    return makeOverviewsProps(strapiOverviews, overviews);
  } else return overviews;
};

export const getGuideListPagesProps = async () => {
  const {
    config: { FETCH_FROM_STRAPI: fetchFromStrapi },
  } = buildEnv;

  if (fetchFromStrapi) {
    const strapiGuideList = await fetchGuideListPages(buildEnv);
    return makeGuideListPagesProps(strapiGuideList, guideLists);
  } else {
    return guideLists;
  }
};

// Due to not exported type from 'gitbook-docs/parseDoc' and problems with the derivative types,
// we had to manage cache with two dedicated variables
// eslint-disable-next-line
let cachedGuides = guides;
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
  const {
    config: { FETCH_FROM_STRAPI: fetchFromStrapi },
  } = buildEnv;

  if (fetchFromStrapi) {
    const strapiGuides = await fetchGuides(buildEnv);
    return makeGuidesProps(strapiGuides, guidesDefinitions).flatMap(makeGuide);
  }
  return guides;
};

import { pipe } from 'fp-ts/lib/function';
import * as E from 'fp-ts/lib/Either';
import { makeBuildConfig } from '@/BuildConfig';
import { makeBuildEnv } from '@/BuildEnv';
import { makeHomepageProps, makeHomepagePropsFromStatic } from './homepage';
import { fetchHomepage } from '@/lib/strapi/fetches/fetchHomepage';
import { translations } from '@/_contents/translations';
import { makeWebinarsProps } from './webinars';
import { fetchWebinars } from './strapi/fetches/fetchWebinars';
import { fetchTutorials } from './strapi/fetches/fetchTutorials';
import { makeTutorialsProps } from './tutorials';
import { fetchQuickStartGuides } from './strapi/fetches/fetchQuickStartGuides';
import {
  makeQuickStartGuidesProps,
  makeQuickStartGuidesPropsFromStatic,
} from './quickStarts';
import {
  guidesDefinitions,
  products,
  quickStartGuides,
  overviews,
  guideLists,
  tutorialLists,
} from '@/_contents/products';
import { makeCaseHistoriesProps } from './caseHistories';
import { fetchCaseHistories } from './strapi/fetches/fetchCaseHistories';
import { fetchSolutions } from './strapi/fetches/fetchSolutions';
import { makeDetailSolutionsProps, makeFullSolutionsProps } from './solutions';
import { makeSolutionListProps } from './solutionList';
import { fetchSolutionListPage } from './strapi/fetches/fetchSolutionListPage';
import { fetchApiDataListPages } from './strapi/fetches/fetchApiDataListPages';
import { makeApiDataListPageProps } from './apiDataListPages';
import { makeApiDataProps } from './apiDataPages';
import { fetchApiDataList } from './strapi/fetches/fetchApiDataList';
import { fetchProducts } from './strapi/codecs/ProductCodec';
import { makeProductsProps } from './products';
import { fetchGuideListPages } from './strapi/fetches/fetchGuideListPages';
import { makeGuideListPagesProps } from './guideListPages';
import { fetchGuides } from './strapi/fetches/fetchGuides';
import { makeGuidesProps } from './guides';
import { makeGuide } from '@/_contents/makeDocs';
import { fetchOverviews } from '@/lib/strapi/fetches/fetchOverviews';
import { makeOverviewsProps } from '@/lib/overviews';
import { fetchTutorialListPages } from './strapi/fetches/fetchTutorialListPages';
import { makeTutorialListPagesProps } from './tutorialListPages';

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

export const getApiDataListPagesProps = async () => {
  const {
    config: { FETCH_FROM_STRAPI: fetchFromStrapi },
  } = buildEnv;

  if (fetchFromStrapi) {
    const apiDataListPages = await fetchApiDataListPages(buildEnv);
    return makeApiDataListPageProps(apiDataListPages);
  } else return [];
};

export const getApiDataProps = async () => {
  const {
    config: { FETCH_FROM_STRAPI: fetchFromStrapi },
  } = buildEnv;

  if (fetchFromStrapi) {
    const apiDataPages = await fetchApiDataList(buildEnv);
    return makeApiDataProps(apiDataPages);
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

export const getFullSolutionsProps = async () => {
  const {
    config: { FETCH_FROM_STRAPI: fetchFromStrapi },
  } = buildEnv;

  if (fetchFromStrapi) {
    const strapiSolutions = await fetchSolutions(buildEnv);
    return makeFullSolutionsProps(strapiSolutions);
  } else {
    return [];
  }
};

export const getDetailSolutionsProps = async () => {
  const {
    config: { FETCH_FROM_STRAPI: fetchFromStrapi },
  } = buildEnv;

  if (fetchFromStrapi) {
    const strapiSolutions = await fetchSolutions(buildEnv);
    return makeDetailSolutionsProps(strapiSolutions);
  } else {
    return [];
  }
};

export const getSolutionsListProps = async () => {
  const {
    config: { FETCH_FROM_STRAPI: fetchFromStrapi },
  } = buildEnv;

  if (fetchFromStrapi) {
    const strapiSolutionsList = await fetchSolutionListPage(buildEnv);
    return makeSolutionListProps(strapiSolutionsList);
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

export const getGuidesProps = async () => {
  const {
    config: { FETCH_FROM_STRAPI: fetchFromStrapi },
  } = buildEnv;

  if (fetchFromStrapi) {
    const strapiGuides = await fetchGuides(buildEnv);
    return makeGuidesProps(strapiGuides, guidesDefinitions).flatMap(makeGuide);
  } else {
    return guidesDefinitions.flatMap(makeGuide);
  }
};

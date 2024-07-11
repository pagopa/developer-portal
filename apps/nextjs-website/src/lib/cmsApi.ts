import { pipe } from 'fp-ts/lib/function';
import * as E from 'fp-ts/lib/Either';
import { makeBuildConfig } from '@/BuildConfig';
import { makeBuildEnv } from '@/BuildEnv';
import { makeHomepageProps, makeHomepagePropsFromStatic } from './homepage';
import { fetchHomepage } from '@/lib/strapi/homepage';
import { translations } from '@/_contents/translations';
import { makeWebinarsProps } from './webinars';
import { fetchWebinars } from './strapi/webinars';
import { fetchTutorials } from './strapi/tutorial';
import { makeTutorialsProps } from './tutorials';
import { fetchQuickStarts } from './strapi/quickStarts';
import {
  makeQuickStartsProps,
  makeQuickStartsPropsFromStatic,
} from './quickStarts';
import { products, quickStartGuides } from '@/_contents/products';
import { makeCaseHistoriesProps } from './caseHistories';
import { fetchCaseHistories } from './strapi/caseHistoriesCodec';
import { fetchSolutions } from './strapi/solutionsCodec';
import { makeDetailSolutionsProps, makeFullSolutionsProps } from './solutions';
import { makeSolutionsListProps } from './solutionsList';
import { fetchSolutionsList } from './strapi/solutionsListCodec';
import { fetchApiDataListPages } from './strapi/ApiDataListPageCodec';
import { makeApiDataListPageProps } from './apiDataListPages';
import { makeApisDataPageProps } from './apiDataPages';
import { fetchApisDataPages } from './strapi/codecs/ApiDataCodec';
import { fetchProducts } from './strapi/codecs/ProductCodec';
import { makeProductProps } from './products';

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
    return makeProductProps(strapiProducts, products);
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

export const getQuickStartsProps = async () => {
  const {
    config: { FETCH_FROM_STRAPI: fetchFromStrapi },
  } = buildEnv;

  if (fetchFromStrapi) {
    const strapiQuickStart = await fetchQuickStarts(buildEnv);
    return makeQuickStartsProps(strapiQuickStart, quickStartGuides);
  } else {
    return makeQuickStartsPropsFromStatic(quickStartGuides);
  }
};

export const getApiDataListPageProps = async () => {
  const {
    config: { FETCH_FROM_STRAPI: fetchFromStrapi },
  } = buildEnv;

  if (fetchFromStrapi) {
    const apiDataListPages = await fetchApiDataListPages(buildEnv);
    return makeApiDataListPageProps(apiDataListPages);
  } else return [];
};

export const getApisDataPageProps = async () => {
  const {
    config: { FETCH_FROM_STRAPI: fetchFromStrapi },
  } = buildEnv;

  if (fetchFromStrapi) {
    const apisDataPages = await fetchApisDataPages(buildEnv);
    return makeApisDataPageProps(apisDataPages);
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
    const strapiSolutionsList = await fetchSolutionsList(buildEnv);
    return makeSolutionsListProps(strapiSolutionsList);
  }
};

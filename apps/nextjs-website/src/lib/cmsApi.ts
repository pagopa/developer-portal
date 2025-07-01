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
import { fetchGuideListPages } from './strapi/fetches/fetchGuideListPages';
import { makeGuideListPagesProps } from './strapi/makeProps/makeGuideListPages';
import { fetchGuide, fetchGuides } from './strapi/fetches/fetchGuides';
import { makeGuidesProps } from './strapi/makeProps/makeGuides';
import { fetchOverviews } from '@/lib/strapi/fetches/fetchOverviews';
import { makeOverviewsProps } from '@/lib/strapi/makeProps/makeOverviews';
import { fetchTutorialListPages } from './strapi/fetches/fetchTutorialListPages';
import { makeTutorialListPagesProps } from './strapi/makeProps/makeTutorialListPages';
import { fetchUrlReplaceMap } from './strapi/fetches/fetchUrlReplaceMap';
import { makeUrlReplaceMap } from './strapi/makeProps/makeUrlReplaceMap';
import { withCache, getCacheKey } from './cache';
import { makeReleaseNotesProps } from '@/lib/strapi/makeProps/makeReleaseNotes';
import { fetchReleaseNote } from '@/lib/strapi/fetches/fetchReleaseNotes';
import {
  makeGuide as makeGuideS3,
  makeSolution as makeSolutionS3,
  makeReleaseNote as makeReleaseNoteS3,
} from '@/helpers/makeS3Docs.helpers';
// import { makeGuide, makeReleaseNote } from '@/helpers/makeDocs.helpers';
import { secrets } from '@/config';
import { fetchWebinarCategories } from '@/lib/strapi/fetches/fetchWebinarCategories';
import { makeWebinarCategoriesProps } from '@/lib/strapi/makeProps/makeWebinarCategories';
import { JsonMetadata } from '@/helpers/s3Metadata.helpers';

// a BuildEnv instance ready to be used
const buildEnv = pipe(
  makeBuildConfig(Object.keys(secrets).length > 0 ? secrets : process.env),
  E.map(makeBuildEnv),
  E.getOrElseW((errors) => {
    // eslint-disable-next-line functional/no-throw-statements
    throw errors;
  })
);

const CACHE_EXPIRY_IN_SECONDS = 900; // 15 minutes in seconds

export const getHomepageProps = async () => {
  return withCache(
    getCacheKey('getHomepageProps'),
    async () => {
      const strapiHomepage = await fetchHomepage(buildEnv);
      return makeHomepageProps(strapiHomepage);
    },
    CACHE_EXPIRY_IN_SECONDS
  );
};

export const getWebinarsProps = async () => {
  return withCache(
    getCacheKey('getWebinarsProps'),
    async () => {
      const strapiWebinars = await fetchWebinars(buildEnv);
      return makeWebinarsProps(strapiWebinars);
    },
    CACHE_EXPIRY_IN_SECONDS
  );
};

export const getProductsProps = async () => {
  return withCache(
    getCacheKey('getProductsProps'),
    async () => {
      const strapiProducts = await fetchProducts(buildEnv);
      return makeProductsProps(strapiProducts);
    },
    CACHE_EXPIRY_IN_SECONDS
  );
};

export const getWebinarCategoriesProps = async () => {
  return withCache(
    getCacheKey('getWebinarCategoriesProps'),
    async () => {
      const strapiWebinarCategories = await fetchWebinarCategories(buildEnv);
      return makeWebinarCategoriesProps(strapiWebinarCategories);
    },
    CACHE_EXPIRY_IN_SECONDS
  );
};

export const getTutorialsProps = async () => {
  return withCache(
    getCacheKey('getTutorialsProps'),
    async () => {
      const strapiTutorials = await fetchTutorials(buildEnv);
      return makeTutorialsProps(strapiTutorials);
    },
    CACHE_EXPIRY_IN_SECONDS
  );
};

export const getTutorialListPagesProps = async () => {
  return withCache(
    getCacheKey('getTutorialListPagesProps'),
    async () => {
      const strapiTutorialListPages = await fetchTutorialListPages(buildEnv);
      return makeTutorialListPagesProps(strapiTutorialListPages);
    },
    CACHE_EXPIRY_IN_SECONDS
  );
};

export const getQuickStartGuidesProps = async () => {
  return withCache(
    getCacheKey('getQuickStartGuidesProps'),
    async () => {
      const strapiQuickStartGuides = await fetchQuickStartGuides(buildEnv);
      return makeQuickStartGuidesProps(strapiQuickStartGuides);
    },
    CACHE_EXPIRY_IN_SECONDS
  );
};

export const getUrlReplaceMapProps = async () => {
  const result = await withCache(
    getCacheKey('getUrlReplaceMapProps'),
    async () => {
      const strapiUrlReplaceMap = await fetchUrlReplaceMap(buildEnv);
      const processed = makeUrlReplaceMap(strapiUrlReplaceMap);
      return processed;
    },
    CACHE_EXPIRY_IN_SECONDS
  );

  return result;
};

export const getApiDataListPagesProps = async () => {
  return withCache(
    getCacheKey('getApiDataListPagesProps'),
    async () => {
      const strapiApiDataListPages = await fetchApiDataListPages(buildEnv);
      return makeApiDataListPagesProps(strapiApiDataListPages);
    },
    CACHE_EXPIRY_IN_SECONDS
  );
};

export const getApiDataProps = async () => {
  return withCache(
    getCacheKey('getApiDataProps'),
    async () => {
      const strapiApiDataList = await fetchApiDataList(buildEnv);
      return makeApiDataListProps(strapiApiDataList);
    },
    CACHE_EXPIRY_IN_SECONDS
  );
};

export const getCaseHistoriesProps = async () => {
  return withCache(
    getCacheKey('getCaseHistoriesProps'),
    async () => {
      const strapiCaseHistories = await fetchCaseHistories(buildEnv);
      return makeCaseHistoriesProps(strapiCaseHistories);
    },
    CACHE_EXPIRY_IN_SECONDS
  );
};

export const getSolutionsProps = async () => {
  return withCache(
    getCacheKey('getSolutionsProps'),
    async () => {
      const strapiSolutions = await fetchSolutions(buildEnv);
      return makeSolutionsProps(strapiSolutions);
    },
    CACHE_EXPIRY_IN_SECONDS
  );
};

export const getSolutionListPageProps = async () => {
  return withCache(
    getCacheKey('getSolutionListPageProps'),
    async () => {
      const strapiSolutionListPage = await fetchSolutionListPage(buildEnv);
      return makeSolutionListPageProps(strapiSolutionListPage);
    },
    CACHE_EXPIRY_IN_SECONDS
  );
};

export const getOverviewsProps = async () => {
  return withCache(
    getCacheKey('getOverviewsProps'),
    async () => {
      const strapiOverviews = await fetchOverviews(buildEnv);
      return makeOverviewsProps(strapiOverviews);
    },
    CACHE_EXPIRY_IN_SECONDS
  );
};

export const getGuideListPagesProps = async () => {
  return withCache(
    getCacheKey('getGuideListPagesProps'),
    async () => {
      const strapiGuideList = await fetchGuideListPages(buildEnv);
      return makeGuideListPagesProps(strapiGuideList);
    },
    CACHE_EXPIRY_IN_SECONDS
  );
};

export const getGuidesProps = async () => {
  return withCache(
    getCacheKey('getGuidesPropsCache'),
    async () => {
      const strapiGuides = await fetchGuides(buildEnv);
      return makeGuidesProps(strapiGuides);
    },
    CACHE_EXPIRY_IN_SECONDS
  );
};

export const getGuides = async () => {
  const strapiGuides = await fetchGuides(buildEnv);
  return makeGuidesProps(strapiGuides);
};

export const getGuideProps = async (
  guidePaths: ReadonlyArray<string>,
  productSlug: string
) => {
  const strapiGuides = await fetchGuide(guidePaths[0], productSlug)(buildEnv);
  if (!strapiGuides || strapiGuides.data.length < 1) {
    // eslint-disable-next-line functional/no-throw-statements
    throw new Error('Failed to fetch data');
  }
  const guide = makeGuidesProps(strapiGuides)[0];
  return await makeGuideS3({ guideDefinition: guide, guidePaths });
};

export const getGuidePageProps = async (
  guideSlug: string,
  productSlug: string
) => {
  const strapiGuides = await fetchGuide(guideSlug, productSlug)(buildEnv);
  if (!strapiGuides || strapiGuides.data.length < 1) {
    // eslint-disable-next-line functional/no-throw-statements
    throw new Error('Failed to fetch data');
  }

  const guidesProps = makeGuidesProps(strapiGuides);

  return guidesProps[0];
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

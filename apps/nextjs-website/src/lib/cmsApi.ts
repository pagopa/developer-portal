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
import { makeTutorialListPagesProps } from './strapi/makeProps/makeTutorialPagesProps';
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
import { secrets } from '@/config';
import { fetchWebinarCategories } from '@/lib/strapi/fetches/fetchWebinarCategories';
import { makeWebinarCategoriesProps } from '@/lib/strapi/makeProps/makeWebinarCategories';
import {
  fetchResponseFromCDN,
  JsonMetadata,
} from '@/helpers/s3Metadata.helpers';
import { StrapiGuideLists } from '@/lib/strapi/types/guideList';
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

const CACHE_EXPIRY_IN_SECONDS = 60; // 1 minute in seconds
const GUIDE_PAGE_CACHE_EXPIRY_IN_SECONDS = 10; // 10 seconds for guide pages

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
  return withCache(
    getCacheKey('getUrlReplaceMapProps'),
    async () => {
      const strapiUrlReplaceMap = await fetchUrlReplaceMap(buildEnv);
      return makeUrlReplaceMap(strapiUrlReplaceMap);
    },
    CACHE_EXPIRY_IN_SECONDS
  );
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
      return await makeApiDataListProps(strapiApiDataList);
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
      const strapiGuideList = (await fetchResponseFromCDN(
        'synced-guide-list-pages-response.json'
      )) as StrapiGuideLists | undefined;
      return strapiGuideList ? makeGuideListPagesProps(strapiGuideList) : [];
    },
    CACHE_EXPIRY_IN_SECONDS
  );
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
  return withCache(
    getCacheKey('getGuidePageProps'),
    async () => {
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
    },
    GUIDE_PAGE_CACHE_EXPIRY_IN_SECONDS
  );
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

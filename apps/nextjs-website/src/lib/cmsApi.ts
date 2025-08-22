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
import { StrapiGuideListPages } from './strapi/codecs/GuideListPagesCodec';
import { StrapiGuides } from './strapi/codecs/GuidesCodec';

// a BuildEnv instance ready to be used
const buildEnv = pipe(
  makeBuildConfig(Object.keys(secrets).length > 0 ? secrets : process.env),
  E.map(makeBuildEnv),
  E.getOrElseW((errors) => {
    // eslint-disable-next-line functional/no-throw-statements
    throw errors;
  })
);

export const getHomepageProps = async (locale?: string) => {
  const strapiHomepage = await fetchHomepage(locale)(buildEnv);
  return makeHomepageProps(strapiHomepage);
};

export const getWebinarsProps = async (locale?: string) => {
  const strapiWebinars = await fetchWebinars(locale)(buildEnv);
  return makeWebinarsProps(strapiWebinars);
};

export const getProductsProps = async (locale?: string) => {
  const strapiProducts = await fetchProducts(locale)(buildEnv);
  return makeProductsProps(strapiProducts);
};

export const getWebinarCategoriesProps = async (locale?: string) => {
  const strapiWebinarCategories = await fetchWebinarCategories(locale)(
    buildEnv
  );
  return makeWebinarCategoriesProps(strapiWebinarCategories);
};

export const getTutorialsProps = async (locale?: string) => {
  const strapiTutorials = await fetchTutorials(locale)(buildEnv);
  return makeTutorialsProps(strapiTutorials);
};

export const getTutorialListPagesProps = async (locale?: string) => {
  const strapiTutorialListPages = await fetchTutorialListPages(locale)(
    buildEnv
  );
  return makeTutorialListPagesProps(strapiTutorialListPages);
};

export const getQuickStartGuidesProps = async (locale?: string) => {
  const strapiQuickStartGuides = await fetchQuickStartGuides(locale)(buildEnv);
  return makeQuickStartGuidesProps(strapiQuickStartGuides);
};

export const getUrlReplaceMapProps = async (locale?: string) => {
  const strapiUrlReplaceMap = await fetchUrlReplaceMap(locale)(buildEnv);
  const processed = makeUrlReplaceMap(strapiUrlReplaceMap);
  return processed;
};

export const getApiDataListPagesProps = async (locale?: string) => {
  const strapiApiDataListPages = await fetchApiDataListPages(locale)(buildEnv);
  return makeApiDataListPagesProps(strapiApiDataListPages);
};

export const getApiDataProps = async (locale?: string) => {
  const strapiApiDataList = await fetchApiDataList(locale)(buildEnv);
  return await makeApiDataListProps(strapiApiDataList);
};

export const getCaseHistoriesProps = async (locale?: string) => {
  const strapiCaseHistories = await fetchCaseHistories(locale)(buildEnv);
  return makeCaseHistoriesProps(strapiCaseHistories);
};

export const getSolutionsProps = async (locale?: string) => {
  const strapiSolutions = await fetchSolutions(locale)(buildEnv);
  return makeSolutionsProps(strapiSolutions);
};

export const getSolutionListPageProps = async (locale?: string) => {
  const strapiSolutionListPage = await fetchSolutionListPage(locale)(buildEnv);
  return makeSolutionListPageProps(strapiSolutionListPage);
};

export const getOverviewsProps = async (locale?: string) => {
  const strapiOverviews = await fetchOverviews(locale)(buildEnv);
  return makeOverviewsProps(strapiOverviews);
};

export const getGuideListPagesProps = async (
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  locale?: string
) => {
  const strapiGuideList = (await fetchResponseFromCDN(
    'synced-guide-list-pages-response.json'
  )) as StrapiGuideListPages | undefined;
  return strapiGuideList ? makeGuideListPagesProps(strapiGuideList) : [];
};

export const getGuideProps = async (
  guidePaths: ReadonlyArray<string>,
  productSlug: string,
  locale?: string
) => {
  const guide = await getGuidePageProps(guidePaths[0], productSlug, locale);
  return await makeGuideS3({ guideDefinition: guide, guidePaths });
};

export const getGuidePageProps = async (
  guideSlug: string,
  productSlug: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  locale?: string
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
  jsonMetadata?: JsonMetadata,
  locale?: string
) => {
  const strapiSolutions = await fetchSolution(solutionsSlug, locale)(buildEnv);
  if (!strapiSolutions || strapiSolutions.data.length < 1) {
    // eslint-disable-next-line functional/no-throw-statements
    throw new Error('Failed to fetch data');
  }
  const solution = makeSolutionsProps(strapiSolutions)[0];
  return await makeSolutionS3(solution, jsonMetadata);
};

export const getReleaseNoteProps = async (
  productSlug: string,
  jsonMetadata?: JsonMetadata,
  locale?: string
) => {
  const strapiReleaseNotes = await fetchReleaseNote(
    productSlug,
    locale
  )(buildEnv);
  if (!strapiReleaseNotes || strapiReleaseNotes.data.length < 1) {
    // eslint-disable-next-line functional/no-throw-statements
    throw new Error('Failed to fetch data');
  }
  const releaseNote = makeReleaseNotesProps(strapiReleaseNotes)[0];
  return await makeReleaseNoteS3(releaseNote, jsonMetadata);
};

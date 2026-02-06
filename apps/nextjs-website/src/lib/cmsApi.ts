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
import { StrapiGuides } from '@/lib/strapi/types/guide';
import { fetchUseCases } from '@/lib/strapi/fetches/fetchUseCases';
import { makeUseCasesProps } from '@/lib/strapi/makeProps/makeUseCases';
import { fetchUseCaseListPages } from '@/lib/strapi/fetches/fetchUseCaseListPages';
import { makeUseCaseListPagesProps } from '@/lib/strapi/makeProps/makeUseCaseListPages';
import { fetchTags } from '@/lib/strapi/fetches/fetchTags';
import { makeTagsProps } from '@/lib/strapi/makeProps/makeTags';
import { isMarkDownPart, MarkDownPart } from '@/lib/strapi/types/part';
import { getMarkdownContent } from '@/lib/api';
import { fetchGuideListPages } from './strapi/fetches/fetchGuideListPages';
import {
  getSyncedGuidesResponseJsonPath,
  getSyncedSolutionsResponseJsonPath,
  getSyncedReleaseNotesResponseJsonPath,
} from 'gitbook-docs/syncedResponses';
import { StrapiSolutions } from './strapi/types/solutions';
import { StrapiReleaseNotes } from './strapi/types/releaseNotes';

// a BuildEnv instance ready to be used
const buildEnv = pipe(
  makeBuildConfig(Object.keys(secrets).length > 0 ? secrets : process.env),
  E.map(makeBuildEnv),
  E.getOrElseW((errors) => {
    // eslint-disable-next-line functional/no-throw-statements
    throw errors;
  })
);

export const getHomepageProps = async (locale: string) => {
  const strapiHomepage = await fetchHomepage(locale, buildEnv);
  return makeHomepageProps(strapiHomepage);
};

export const getWebinarsProps = async (locale: string) => {
  const strapiWebinars = await fetchWebinars(locale, buildEnv);
  return makeWebinarsProps(strapiWebinars);
};

export const getProductsProps = async (locale: string) => {
  const strapiProducts = await fetchProducts(locale, buildEnv);
  const products = makeProductsProps(locale, strapiProducts);
  return [...products].sort((productA, productB) =>
    productA.name.localeCompare(productB.name)
  );
};

export const getWebinarCategoriesProps = async (locale: string) => {
  const strapiWebinarCategories = await fetchWebinarCategories(
    locale,
    buildEnv
  );
  return makeWebinarCategoriesProps(strapiWebinarCategories);
};

export const getTagsProps = async (locale: string) => {
  const strapiTags = await fetchTags(locale, buildEnv);
  return makeTagsProps(strapiTags);
};

export const getTutorialsProps = async (locale: string) => {
  const strapiTutorials = await fetchTutorials(locale, buildEnv);
  const tutorialsWithMarkdown = strapiTutorials.data.filter((tutorial) => {
    const parts = tutorial?.attributes?.parts ?? [];
    return parts.some((part) => part?.__component === 'parts.markdown');
  });
  const allMarkdownParts = tutorialsWithMarkdown.flatMap((tutorial) =>
    (tutorial?.attributes?.parts ?? []).filter(
      (part) => part?.__component === 'parts.markdown'
    )
  );
  const contentPromises = allMarkdownParts.map(async (part) => {
    const { dirName, pathToFile } = part as MarkDownPart;
    const key = `${dirName}/${pathToFile}`;
    const content = await getMarkdownContent(dirName, pathToFile);
    return [key, content];
  });
  const resolvedContentPairs = await Promise.all(contentPromises);
  const markdownContentDict = Object.fromEntries(resolvedContentPairs);
  return makeTutorialsProps(locale, strapiTutorials, markdownContentDict);
};

export const getTutorialListPagesProps = async (locale: string) => {
  const strapiTutorialListPages = await fetchTutorialListPages(
    locale,
    buildEnv
  );
  return makeTutorialListPagesProps(locale, strapiTutorialListPages);
};

export const getQuickStartGuidesProps = async (locale: string) => {
  const strapiQuickStartGuides = await fetchQuickStartGuides(locale, buildEnv);
  return makeQuickStartGuidesProps(locale, strapiQuickStartGuides);
};

export const getUrlReplaceMapProps = async (locale: string) => {
  const strapiUrlReplaceMap = await fetchUrlReplaceMap(locale, buildEnv);
  const processed = makeUrlReplaceMap(strapiUrlReplaceMap);
  return processed;
};

export const getApiDataListPagesProps = async (locale: string) => {
  const strapiApiDataListPages = await fetchApiDataListPages(locale, buildEnv);
  return makeApiDataListPagesProps(locale, strapiApiDataListPages);
};

export const getApiDataProps = async (locale: string) => {
  const strapiApiDataList = await fetchApiDataList(locale, buildEnv);
  return await makeApiDataListProps(locale, strapiApiDataList);
};

export const getCaseHistoriesProps = async (locale: string) => {
  const strapiCaseHistories = await fetchCaseHistories(locale, buildEnv);
  return makeCaseHistoriesProps(strapiCaseHistories);
};

export const getSolutionsProps = async (locale: string) => {
  const strapiSolutions = (await fetchResponseFromCDN(
    `${locale}/${getSyncedSolutionsResponseJsonPath()}`
  )) as StrapiSolutions | undefined;
  return strapiSolutions ? makeSolutionsProps(locale, strapiSolutions) : [];
};

export const getSolutionListPageProps = async (locale: string) => {
  const strapiSolutionListPage = await fetchSolutionListPage(locale, buildEnv);
  return makeSolutionListPageProps(locale, strapiSolutionListPage);
};

export const getOverviewsProps = async (locale: string) => {
  const strapiOverviews = await fetchOverviews(locale, buildEnv);
  return makeOverviewsProps(locale, strapiOverviews);
};

export const getGuideListPagesProps = async (locale: string) => {
  const strapiGuideList = await fetchGuideListPages(locale, buildEnv);
  return strapiGuideList
    ? makeGuideListPagesProps(locale, strapiGuideList)
    : [];
};

export const getGuideProps = async (
  guidePaths: ReadonlyArray<string>,
  locale: string,
  productSlug: string
) => {
  const guide = await getGuidePageProps(guidePaths[0], locale, productSlug);
  return await makeGuideS3({ guideDefinition: guide, locale, guidePaths });
};

export const getGuidesProps = async (locale: string) => {
  const strapiGuides = (await fetchResponseFromCDN(
    getSyncedGuidesResponseJsonPath()
  )) as StrapiGuides | undefined;
  return strapiGuides ? makeGuidesProps(locale, strapiGuides) : [];
};

export const getGuidePageProps = async (
  guideSlug: string,
  locale: string,
  productSlug: string
) => {
  const strapiGuides = (await fetchResponseFromCDN(
    `${locale}/${getSyncedGuidesResponseJsonPath()}`
  )) as StrapiGuides | undefined;
  // eslint-disable-next-line functional/no-expression-statements
  const guides = strapiGuides ? makeGuidesProps(locale, strapiGuides) : [];
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
  locale: string,
  jsonMetadata?: JsonMetadata
) => {
  const strapiSolutions = (await fetchResponseFromCDN(
    `${locale}/${getSyncedSolutionsResponseJsonPath()}`
  )) as StrapiSolutions | undefined;
  if (!strapiSolutions || strapiSolutions.data.length < 1) {
    // eslint-disable-next-line functional/no-throw-statements
    throw new Error('Failed to fetch solution data');
  }
  const solutions = makeSolutionsProps(locale, strapiSolutions);
  const solution = solutions.find((s) => s.slug === solutionsSlug);
  if (!solution) {
    // eslint-disable-next-line functional/no-throw-statements
    throw new Error(`No solution found matching slug "${solutionsSlug}"`);
  }
  return await makeSolutionS3(solution, locale, jsonMetadata);
};

const fetchReleaseNotes = async (locale: string) => {
  const strapiReleaseNotes = (await fetchResponseFromCDN(
    `${locale}/${getSyncedReleaseNotesResponseJsonPath()}`
  )) as StrapiReleaseNotes | undefined;
  if (!strapiReleaseNotes || strapiReleaseNotes.data.length < 1) {
    // eslint-disable-next-line functional/no-throw-statements
    throw new Error('Failed to fetch release data');
  }
  return strapiReleaseNotes;
};

export const getStrapiReleaseNotes = async (
  locale: string,
  productSlug: string
) => {
  const strapiReleaseNotes = await fetchReleaseNotes(locale);
  return strapiReleaseNotes.data.find(
    (strapiReleaseNote) =>
      strapiReleaseNote.attributes.product.data?.attributes.slug === productSlug
  );
};

export const getReleaseNoteProps = async (
  locale: string,
  productSlug: string,
  jsonMetadata?: JsonMetadata
) => {
  const strapiReleaseNotes = await fetchReleaseNotes(locale);
  const releaseNotes = makeReleaseNotesProps(locale, strapiReleaseNotes);
  const releaseNote = releaseNotes.find(
    (rn) => rn.product.slug === productSlug
  );
  if (!releaseNote) {
    // eslint-disable-next-line functional/no-throw-statements
    throw new Error(
      `No release data found matching product slug "${productSlug}"`
    );
  }
  return await makeReleaseNoteS3(releaseNote, locale, jsonMetadata);
};

export const getReleaseNotesProps = async (locale: string) => {
  const strapiReleaseNotes = await fetchReleaseNotes(locale);
  return makeReleaseNotesProps(locale, strapiReleaseNotes);
};

export const getUseCasesProps = async (locale: string) => {
  const strapiUseCases = await fetchUseCases(locale, buildEnv);
  const allMarkdownParts = strapiUseCases.data.flatMap((useCase) =>
    (useCase?.attributes?.parts ?? []).filter(isMarkDownPart)
  );
  const contentPromises = allMarkdownParts.map(async (part) => {
    const { dirName, pathToFile } = part;
    const key = `${dirName}/${pathToFile}`;
    const content = await getMarkdownContent(dirName, pathToFile);
    return [key, content];
  });
  const resolvedContentPairs = await Promise.all(contentPromises);
  const markdownContentDict = Object.fromEntries(resolvedContentPairs);
  return makeUseCasesProps(locale, strapiUseCases, markdownContentDict);
};

export const getUseCaseListPagesProps = async (locale: string) => {
  const strapiUseCasesListPages = await fetchUseCaseListPages(locale, buildEnv);
  return makeUseCaseListPagesProps(locale, strapiUseCasesListPages);
};

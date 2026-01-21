import type { MetadataRoute } from 'next';
import { getApiDataParams } from '@/lib/api';
import {
  getGuideListPagesProps,
  getCaseHistoriesProps,
  getProductsProps,
  getTutorialsProps,
  getWebinarsProps,
  getSolutionsProps,
  getQuickStartGuidesProps,
  getHomepageProps,
  getOverviewsProps,
  getTutorialListPagesProps,
} from '@/lib/cmsApi';
import { baseUrl } from '@/config';
import {
  getGuidesMetadata,
  getReleaseNotesMetadata,
  getSolutionsMetadata,
  JsonMetadata,
} from '@/helpers/s3Metadata.helpers';
import { OverviewPageProps } from '@/app/[locale]/[productSlug]/overview/page';
import { TutorialsPageProps } from '@/app/[locale]/[productSlug]/tutorials/page';

export const dynamic = 'force-dynamic';

function getProductsPagesProps(
  productSlugs: readonly string[],
  overviewProps: readonly OverviewPageProps[],
  tutorialListPages: readonly TutorialsPageProps[]
) {
  return productSlugs.map((productSlug) => {
    const overview = overviewProps.find(
      (overviewData) => overviewData.product?.slug === productSlug
    );
    const tutorialList = tutorialListPages.find(
      ({ product }) => product.slug === productSlug
    );
    return { overview, tutorialList };
  });
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Get dynamic paths
  const quickStartParams = await getQuickStartGuidesProps();
  const apiDataParams = await getApiDataParams();
  const guideListPages = await getGuideListPagesProps();
  const caseHistories = await getCaseHistoriesProps();
  const productSlugs = (await getProductsProps())
    .filter((product) => product.isVisible)
    .map((product) => product.slug);

  // Fetch metadata from S3
  const guidesMetadata = await getGuidesMetadata('it'); // TODO: remove hardcoded locale once i18n development on sitemap has been completed
  const solutionsMetadata = await getSolutionsMetadata('it'); // TODO: remove hardcoded locale once i18n development on sitemap has been completed
  const releaseNotesMetadata = await getReleaseNotesMetadata('it'); // TODO: remove hardcoded locale once i18n development on sitemap has been completed
  const overviews = await getOverviewsProps();
  const tutorialListPages = await getTutorialListPagesProps();
  const productPages = getProductsPagesProps(
    productSlugs,
    overviews,
    tutorialListPages
  );
  const homePage = await getHomepageProps();
  // Base routes
  const routes = [
    {
      url: baseUrl,
      lastModified: new Date(homePage.updatedAt),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms-of-service`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.3,
    },
  ];

  const quickStartRoutes = quickStartParams.map((quickStart) => ({
    url: `${baseUrl}/${quickStart.product.slug}/quick-start`,
    lastModified: new Date(quickStart.updatedAt || Date.now()),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // Case histories
  const caseHistoryRoutes = caseHistories.map(({ slug, updatedAt }) => ({
    url: `${baseUrl}/case-histories/${slug}`,
    lastModified: new Date(updatedAt || Date.now()),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  // Product routes
  const productRoutes = productSlugs.flatMap((productSlug) => {
    const routes = productPages.find((productPage) => {
      return (
        productPage.overview?.product.slug === productSlug ||
        productPage.tutorialList?.product.slug === productSlug
      );
    });
    const hasTutorials = routes?.tutorialList !== undefined;
    const returnArray = [];
    if (routes?.overview)
      // eslint-disable-next-line functional/immutable-data,functional/no-expression-statements
      returnArray.push({
        url: `${baseUrl}/${productSlug}/overview`,
        lastModified: new Date(routes?.overview?.updatedAt || Date.now()),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      });
    if (hasTutorials)
      // eslint-disable-next-line functional/immutable-data,functional/no-expression-statements
      returnArray.push({
        url: `${baseUrl}/${productSlug}/tutorials`,
        lastModified: new Date(routes?.tutorialList?.updatedAt || Date.now()),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      });
    return returnArray;
  });

  // API routes
  const apiRoutes = apiDataParams.map(
    ({ productSlug, apiDataSlug, updatedAt }) => ({
      url: `${baseUrl}/${productSlug}/api/${apiDataSlug}`,
      lastModified: new Date(updatedAt || Date.now()),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    })
  );

  // Guide list pages
  const guideListPagesRoutes = guideListPages.map((guide) => ({
    url: `${baseUrl}/${guide.product.slug}/guides`,
    lastModified: new Date(guide.updatedAt || Date.now()),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  const tutorials = await getTutorialsProps();
  const tutorialRoutes = tutorials.map((tutorial) => ({
    url: `${baseUrl}${tutorial.path}`,
    lastModified: new Date(tutorial.updatedAt || Date.now()),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  const webinars = await getWebinarsProps();
  const webinarRoutes = webinars.map((webinar) => ({
    url: `${baseUrl}/webinars/${webinar.slug}`,
    lastModified: new Date(webinar.updatedAt || Date.now()),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  const solutions = await getSolutionsProps('it'); // TODO: remove hardcoded locale once i18n development on sitemap has been completed
  const solutionRoutes = solutions.map((solution) => ({
    url: `${baseUrl}/solutions/${solution.slug}`,
    lastModified: new Date(solution.updatedAt || Date.now()),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  const solutionsDetailRoutes = solutions.map((solution) => ({
    url: `${baseUrl}/solutions/${solution.slug}/details`,
    lastModified: new Date(solution.updatedAt || Date.now()),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  const lastSolutionUpdatedAt =
    solutions.length <= 0
      ? ''
      : solutions.reduce((latest, current) => {
          const latestDate = new Date(latest.updatedAt || '');
          const currentDate = new Date(current.updatedAt || '');
          return currentDate > latestDate ? current : latest;
        }).updatedAt;
  const lastWebinarUpdatedAt =
    webinars.length <= 0
      ? ''
      : webinars.reduce((latest, current) => {
          const latestDate = new Date(latest.updatedAt || '');
          const currentDate = new Date(current.updatedAt || '');
          return currentDate > latestDate ? current : latest;
        }).updatedAt;

  // Add main section routes
  const sectionRoutes = [
    {
      url: `${baseUrl}/solutions`,
      lastModified: new Date(lastSolutionUpdatedAt || Date.now()),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/webinars`,
      lastModified: new Date(lastWebinarUpdatedAt || Date.now()),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
  ];

  // Generate routes for guides from S3 metadata
  const s3GuideRoutes = guidesMetadata.map((guide: JsonMetadata) => ({
    url: `${baseUrl}${guide.path}`,
    lastModified: new Date(guide.lastModified || Date.now()),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  // Generate routes for solutions from S3 metadata
  const s3SolutionRoutes = solutionsMetadata.map((solution: JsonMetadata) => ({
    url: `${baseUrl}${solution.path}`,
    lastModified: new Date(solution.lastModified || Date.now()),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  // Generate routes for release notes from S3 metadata
  const s3ReleaseNoteRoutes = releaseNotesMetadata.map(
    (releaseNote: JsonMetadata) => ({
      url: `${baseUrl}${releaseNote.path}`,
      lastModified: new Date(releaseNote.lastModified || Date.now()),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    })
  );

  return [
    ...routes,
    ...quickStartRoutes,
    ...caseHistoryRoutes,
    ...productRoutes,
    ...apiRoutes,
    ...guideListPagesRoutes,
    ...tutorialRoutes,
    ...webinarRoutes,
    ...solutionRoutes,
    ...solutionsDetailRoutes,
    ...sectionRoutes,
    ...s3GuideRoutes,
    ...s3SolutionRoutes,
    ...s3ReleaseNoteRoutes,
  ];
}

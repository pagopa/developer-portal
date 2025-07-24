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
} from '@/lib/cmsApi';
import { baseUrl } from '@/config';
import {
  getGuidesMetadata,
  getReleaseNotesMetadata,
  getSolutionsMetadata,
  JsonMetadata,
} from '@/helpers/s3Metadata.helpers';

// Force dynamic rendering for the sitemap
export const revalidate = 0;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Get dynamic paths
  const quickStartParams = await getQuickStartGuidesProps();
  const apiDataParams = await getApiDataParams();
  const guideListPages = await getGuideListPagesProps();
  const caseHistories = await getCaseHistoriesProps();
  const productSlugs = (await getProductsProps()).map(
    (product) => product.slug
  );

  // Fetch metadata from S3
  const guidesMetadata = await getGuidesMetadata();
  const solutionsMetadata = await getSolutionsMetadata();
  const releaseNotesMetadata = await getReleaseNotesMetadata();

  // Base routes
  const routes = [
    {
      url: baseUrl,
      lastModified: new Date(),
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
    lastModified: new Date(quickStart.updatedAt || new Date().toISOString()),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // Case histories
  const caseHistoryRoutes = caseHistories.map(({ slug, updatedAt }) => ({
    url: `${baseUrl}/case-histories/${slug}`,
    lastModified: new Date(updatedAt || new Date().toISOString()),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  // Product routes
  const productRoutes = productSlugs.flatMap((productSlug) => [
    {
      url: `${baseUrl}/${productSlug}/overview`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/${productSlug}/tutorials`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/${productSlug}/guides`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
  ]);

  // API routes
  const apiRoutes = apiDataParams.map(
    ({ productSlug, apiDataSlug, updatedAt }) => ({
      url: `${baseUrl}/${productSlug}/api/${apiDataSlug}`,
      lastModified: new Date(updatedAt || new Date().toISOString()),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    })
  );

  // Guide list pages
  const guidePagesRoutes = guideListPages.map((guide) => ({
    url: `${baseUrl}/${guide.product.slug}/guides`,
    lastModified: new Date(guide.updatedAt || new Date().toISOString()),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  const tutorials = await getTutorialsProps();
  const tutorialRoutes = tutorials.map((tutorial) => ({
    url: `${baseUrl}${tutorial.path}`,
    lastModified: new Date(tutorial.updatedAt || new Date().toISOString()),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  const webinars = await getWebinarsProps();
  const webinarRoutes = webinars.map((webinar) => ({
    url: `${baseUrl}/webinars/${webinar.slug}`,
    lastModified: new Date(webinar.updatedAt || new Date().toISOString()),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  const solutions = await getSolutionsProps();
  const solutionRoutes = solutions.map((solution) => ({
    url: `${baseUrl}/solutions/${solution.slug}`,
    lastModified: new Date(solution.updatedAt || new Date().toISOString()),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  const solutionsDetailRoutes = solutions.map((solution) => ({
    url: `${baseUrl}/solutions/${solution.slug}/details`,
    lastModified: new Date(solution.updatedAt || new Date().toISOString()),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  // Add main section routes
  const sectionRoutes = [
    {
      url: `${baseUrl}/solutions`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/webinars`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
  ];

  // Generate routes for guides from S3 metadata
  const s3GuideRoutes = guidesMetadata.map((guide: JsonMetadata) => ({
    url: `${baseUrl}${guide.path}`,
    lastModified: new Date(guide.lastModified || new Date().toISOString()),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  // Generate routes for solutions from S3 metadata
  const s3SolutionRoutes = solutionsMetadata.map((solution: JsonMetadata) => ({
    url: `${baseUrl}${solution.path}`,
    lastModified: new Date(solution.lastModified || new Date().toISOString()),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  // Generate routes for release notes from S3 metadata
  const s3ReleaseNoteRoutes = releaseNotesMetadata.map(
    (releaseNote: JsonMetadata) => ({
      url: `${baseUrl}${releaseNote.path}`,
      lastModified: new Date(
        releaseNote.lastModified || new Date().toISOString()
      ),
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
    ...guidePagesRoutes,
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

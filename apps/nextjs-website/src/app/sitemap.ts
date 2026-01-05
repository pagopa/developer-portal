import type { MetadataRoute } from 'next';
import {
  getAllApiDataListPagesProps,
  getAllCaseHistoriesProps,
  getAllGuideListPagesProps,
  getAllHomepageProps,
  getAllOverviewsProps,
  getAllQuickStartGuidesProps,
  getAllSolutionListPageProps,
  getAllSolutionsProps,
  getAllTutorialListPagesProps,
  getAllTutorialsProps,
  getAllUseCaseListPagesProps,
  getAllUseCasesProps,
  getAllWebinarsProps,
} from '@/lib/cmsApi';
import { baseUrl } from '@/config';
import {
  getGuidesMetadata,
  getReleaseNotesMetadata,
  getSolutionsMetadata,
  JsonMetadata,
} from '@/helpers/s3Metadata.helpers';

export const dynamic = 'force-dynamic';

const getUrl = (path: string, locale: string) =>
  locale === 'it' ? `${baseUrl}${path}` : `${baseUrl}/${locale}${path}`;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [
    homePage,
    quickStartGuides,
    apiDataListPages,
    guideListPages,
    caseHistories,
    overviews,
    tutorialListPages,
    tutorials,
    webinars,
    solutions,
    solutionListPages,
    useCaseListPages,
    useCases,
    guidesMetadata,
    solutionsMetadata,
    releaseNotesMetadata,
  ] = await Promise.all([
    getAllHomepageProps(),
    getAllQuickStartGuidesProps(),
    getAllApiDataListPagesProps(),
    getAllGuideListPagesProps(),
    getAllCaseHistoriesProps(),
    getAllOverviewsProps(),
    getAllTutorialListPagesProps(),
    getAllTutorialsProps(),
    getAllWebinarsProps(),
    getAllSolutionsProps(),
    getAllSolutionListPageProps(),
    getAllUseCaseListPagesProps(),
    getAllUseCasesProps(),
    getGuidesMetadata(),
    getSolutionsMetadata(),
    getReleaseNotesMetadata(),
  ]);

  const homeRoutes: MetadataRoute.Sitemap = [
    {
      url: getUrl('/', homePage.locale),
      lastModified: new Date(homePage.updatedAt),
      changeFrequency: 'daily',
      priority: 1,
    },
    ...(homePage.localizations?.map((loc) => ({
      url: getUrl('/', loc.locale),
      lastModified: new Date(), // We don't have updatedAt for localizations without fetching them
      changeFrequency: 'daily' as const,
      priority: 1,
    })) || []),
  ];

  const quickStartRoutes: MetadataRoute.Sitemap = quickStartGuides.map(
    (guide) => ({
      url: getUrl(guide.path, guide.locale),
      lastModified: new Date(guide.updatedAt || Date.now()),
      changeFrequency: 'weekly',
      priority: 0.8,
    })
  );

  const apiDataRoutes: MetadataRoute.Sitemap = apiDataListPages.map((page) => ({
    url: getUrl(page.path, page.locale),
    lastModified: new Date(page.updatedAt || Date.now()),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  const guideListRoutes: MetadataRoute.Sitemap = guideListPages.map((page) => ({
    url: getUrl(`/${page.product.slug}/guides`, page.locale),
    lastModified: new Date(page.updatedAt || Date.now()),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  const caseHistoryRoutes: MetadataRoute.Sitemap = caseHistories.map(
    (history) => ({
      url: getUrl(`/case-histories/${history.slug}`, history.locale),
      lastModified: new Date(history.updatedAt || Date.now()),
      changeFrequency: 'weekly',
      priority: 0.7,
    })
  );

  const overviewRoutes: MetadataRoute.Sitemap = overviews.map((overview) => ({
    url: getUrl(overview.path, overview.locale),
    lastModified: new Date(overview.updatedAt || Date.now()),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  const tutorialListRoutes: MetadataRoute.Sitemap = tutorialListPages.map(
    (page) => ({
      url: getUrl(page.path, page.locale),
      lastModified: new Date(page.updatedAt || Date.now()),
      changeFrequency: 'weekly',
      priority: 0.8,
    })
  );

  const tutorialRoutes: MetadataRoute.Sitemap = tutorials.map((tutorial) => ({
    url: getUrl(tutorial.path, tutorial.locale),
    lastModified: new Date(tutorial.updatedAt || Date.now()),
    changeFrequency: 'weekly',
    priority: 0.6,
  }));

  const webinarRoutes: MetadataRoute.Sitemap = webinars.map((webinar) => ({
    url: getUrl(`/webinars/${webinar.slug}`, webinar.locale),
    lastModified: new Date(webinar.updatedAt || Date.now()),
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  const solutionListRoutes: MetadataRoute.Sitemap = [
    {
      url: getUrl('/solutions', solutionListPages.locale),
      lastModified: new Date(solutionListPages.updatedAt || Date.now()),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    ...(solutionListPages.localizations?.map((loc) => ({
      url: getUrl('/solutions', loc.locale),
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })) || []),
  ];

  const solutionRoutes: MetadataRoute.Sitemap = solutions.map(
    (solution: any) => ({
      url: getUrl(`/solutions/${solution.slug}`, 'it'),
      lastModified: new Date(solution.updatedAt || Date.now()),
      changeFrequency: 'weekly',
      priority: 0.6,
    })
  );

  const useCaseListRoutes: MetadataRoute.Sitemap = useCaseListPages.map(
    (page) => ({
      url: getUrl(page.path, page.locale),
      lastModified: new Date(page.updatedAt || Date.now()),
      changeFrequency: 'weekly',
      priority: 0.8,
    })
  );

  const useCaseRoutes: MetadataRoute.Sitemap = useCases.map((useCase) => ({
    url: getUrl(useCase.path, useCase.locale),
    lastModified: new Date(useCase.publishedAt?.toString() || Date.now()),
    changeFrequency: 'weekly',
    priority: 0.6,
  }));

  const s3GuideRoutes: MetadataRoute.Sitemap = guidesMetadata.map(
    (guide: JsonMetadata) => ({
      url: `${baseUrl}${guide.path}`,
      lastModified: new Date(guide.lastModified || Date.now()),
      changeFrequency: 'weekly',
      priority: 0.6,
    })
  );

  const s3SolutionRoutes: MetadataRoute.Sitemap = solutionsMetadata.map(
    (solution: JsonMetadata) => ({
      url: `${baseUrl}${solution.path}`,
      lastModified: new Date(solution.lastModified || Date.now()),
      changeFrequency: 'weekly',
      priority: 0.6,
    })
  );

  const s3ReleaseNoteRoutes: MetadataRoute.Sitemap = releaseNotesMetadata.map(
    (releaseNote: JsonMetadata) => ({
      url: `${baseUrl}${releaseNote.path}`,
      lastModified: new Date(releaseNote.lastModified || Date.now()),
      changeFrequency: 'weekly',
      priority: 0.6,
    })
  );

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms-of-service`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
  ];

  return [
    ...homeRoutes,
    ...quickStartRoutes,
    ...apiDataRoutes,
    ...guideListRoutes,
    ...caseHistoryRoutes,
    ...overviewRoutes,
    ...tutorialListRoutes,
    ...tutorialRoutes,
    ...webinarRoutes,
    ...solutionListRoutes,
    ...solutionRoutes,
    ...useCaseListRoutes,
    ...useCaseRoutes,
    ...s3GuideRoutes,
    ...s3SolutionRoutes,
    ...s3ReleaseNoteRoutes,
    ...staticRoutes,
  ];
}

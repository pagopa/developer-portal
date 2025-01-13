import type { MetadataRoute } from 'next';
import { getApiDataParams } from '@/lib/api';
import {
  getGuideListPagesProps,
  getCaseHistoriesProps,
  getProductsProps,
  getTutorialsProps,
  getGuidesProps,
  getWebinarsProps,
  getSolutionsProps,
} from '@/lib/cmsApi';
import { baseUrl } from '@/config';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Get dynamic paths
  const apiDataParams = await getApiDataParams();
  const guideListPages = await getGuideListPagesProps();
  const caseHistories = await getCaseHistoriesProps();
  const productSlugs = (await getProductsProps()).map(
    (product) => product.slug
  );

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
  ];

  // Profile routes
  const profileRoutes = ['/profile/agreements', '/profile/personal-data'].map(
    (route) => ({
      url: `${baseUrl}${route}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.4,
    })
  );

  // Case histories
  const caseHistoryRoutes = caseHistories.map((history) => ({
    url: `${baseUrl}/case-histories/${history.slug}`,
    lastModified: new Date(),
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
      url: `${baseUrl}/${productSlug}/quick-start`,
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
  const apiRoutes = apiDataParams.map(({ productSlug, apiDataSlug }) => ({
    url: `${baseUrl}/${productSlug}/api/${apiDataSlug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  // Guide list pages
  const guidePagesRoutes = guideListPages.map((guide) => ({
    url: `${baseUrl}/${guide.product.slug}/guides`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  const tutorials = await getTutorialsProps();
  const tutorialRoutes = tutorials.map((tutorial) => ({
    url: `${baseUrl}${tutorial.path}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  const guides = await getGuidesProps();
  const guideRoutes = guides.map((guide) => ({
    url: `${baseUrl}${guide.page.path}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  const webinars = await getWebinarsProps();
  const webinarRoutes = webinars.map((webinar) => ({
    url: `${baseUrl}/webinars/${webinar.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  const solutions = await getSolutionsProps();
  const solutionRoutes = solutions.map((solution) => ({
    url: `${baseUrl}/solutions/${solution.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  const solutionsDetailRoutes = solutions.map((solution) => ({
    url: `${baseUrl}/solutions/${solution.slug}/details`,
    lastModified: new Date(),
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

  return [
    ...routes,
    ...profileRoutes,
    ...caseHistoryRoutes,
    ...productRoutes,
    ...apiRoutes,
    ...guidePagesRoutes,
    ...tutorialRoutes,
    ...guideRoutes,
    ...webinarRoutes,
    ...solutionRoutes,
    ...solutionsDetailRoutes,
    ...sectionRoutes,
  ];
}

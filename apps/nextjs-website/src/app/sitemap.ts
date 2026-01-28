import type { MetadataRoute } from 'next';
import {
  getCaseHistoriesProps,
  getHomepageProps,
  getSolutionsProps,
  getWebinarsProps,
} from '@/lib/cmsApi';
import { baseUrl } from '@/config';
import {
  getGuidesMetadata,
  getReleaseNotesMetadata,
  getSolutionsMetadataByDirNames,
  JsonMetadata,
} from '@/helpers/s3Metadata.helpers';
import {
  fetchProductSlugs,
  fetchProductSinglePages,
  fetchProductTutorials,
  fetchProductApiData,
} from '@/lib/strapi/fetches/fetchSitemapData';

export const dynamic = 'force-dynamic';

type SitemapProductRelation = {
  readonly data?: {
    readonly attributes: {
      readonly slug?: string;
      readonly updatedAt: string;
    };
  };
};

type SitemapProductRelations = {
  readonly overview?: SitemapProductRelation;
  readonly quickstart_guide?: SitemapProductRelation;
  readonly tutorial_list_page?: SitemapProductRelation;
  readonly guide_list_page?: SitemapProductRelation;
};

type SitemapApiData = {
  readonly attributes: {
    readonly updatedAt: string;
    readonly apiRestDetail?: { readonly slug: string };
    readonly apiSoapDetail?: { readonly slug: string };
  };
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // --------------------------------------------------------------------------------
  // 1. Fetch Global / Static Pages
  // --------------------------------------------------------------------------------
  const homePage = await getHomepageProps();
  const caseHistories = await getCaseHistoriesProps();
  const webinars = await getWebinarsProps();
  const solutions = await getSolutionsProps('it'); // TODO: remove hardcoded locale once i18n development on sitemap has been completed

  // Base static routes
  const baseRoutes = [
    {
      url: baseUrl,
      lastModified: new Date(homePage.updatedAt),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: new Date(), // Standard static page
      changeFrequency: 'monthly' as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms-of-service`,
      lastModified: new Date(), // Standard static page
      changeFrequency: 'monthly' as const,
      priority: 0.3,
    },
  ];

  // Case History routes (Global collection)
  const caseHistoryRoutes = caseHistories.map(({ slug, updatedAt }) => ({
    url: `${baseUrl}/case-histories/${slug}`,
    lastModified: new Date(updatedAt || Date.now()),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  // Webinar routes (Global collection)
  const webinarRoutes = webinars.map((webinar) => ({
    url: `${baseUrl}/webinars/${webinar.slug}`,
    lastModified: new Date(webinar.updatedAt || Date.now()),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  // Solution routes (Global collection)
  const solutionRoutes = solutions.map((solution) => ({
    url: `${baseUrl}/solutions/${solution.slug}`,
    lastModified: new Date(solution.updatedAt || Date.now()),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  // Solution Details routes
  const solutionsDetailRoutes = solutions.map((solution) => ({
    url: `${baseUrl}/solutions/${solution.slug}/details`,
    lastModified: new Date(solution.updatedAt || Date.now()),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  // Helper to find latest update in a collection
  const getLastUpdate = (
    items: ReadonlyArray<{ readonly updatedAt?: string }>
  ) =>
    items.length <= 0
      ? ''
      : items.reduce((latest, current) => {
          const latestDate = new Date(latest.updatedAt || '');
          const currentDate = new Date(current.updatedAt || '');
          return currentDate > latestDate ? current : latest;
        }).updatedAt;

  // Main Section Routes (Aggregators)
  const sectionRoutes = [
    {
      url: `${baseUrl}/solutions`,
      lastModified: new Date(getLastUpdate(solutions) || Date.now()),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/webinars`,
      lastModified: new Date(getLastUpdate(webinars) || Date.now()),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
  ];

  // --------------------------------------------------------------------------------
  // 2. Fetch S3 Metadata (Guides, Solutions, Release Notes)
  // --------------------------------------------------------------------------------
  // These are stored in S3 and retrieved via legacy helpers.
  // We keep them ensuring no missing legacy content.
  const guidesMetadata = await getGuidesMetadata('it'); // TODO: remove hardcoded locale once i18n development on sitemap has been completed
  const solutionDirNames = Array.from(
    new Set(
      solutions
        .map((solution) => solution.dirName)
        .filter((dirName): dirName is string => Boolean(dirName))
    )
  );
  const solutionsMetadata = await getSolutionsMetadataByDirNames(
    solutionDirNames
  );
  const releaseNotesMetadata = await getReleaseNotesMetadata('it'); // TODO: remove hardcoded locale once i18n development on sitemap has been completed

  const s3GuideRoutes = guidesMetadata.map((guide: JsonMetadata) => ({
    url: `${baseUrl}${guide.path}`,
    lastModified: new Date(guide.lastModified || Date.now()),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  const s3SolutionRoutes = solutionsMetadata.map((solution: JsonMetadata) => ({
    url: `${baseUrl}${solution.path}`,
    lastModified: new Date(solution.lastModified || Date.now()),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  const s3ReleaseNoteRoutes = releaseNotesMetadata.map(
    (releaseNote: JsonMetadata) => ({
      url: `${baseUrl}${releaseNote.path}`,
      lastModified: new Date(releaseNote.lastModified || Date.now()),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    })
  );

  // --------------------------------------------------------------------------------
  // 3. Fetch Product Routes (Iterative Strategy)
  // --------------------------------------------------------------------------------
  // First, fetch all product slugs.
  const productsResult = await fetchProductSlugs();
  const productItems = productsResult.data;

  // Then iterate and fetch details for each product.
  // This avoids massive payload transfers and allows for granular optimization.
  const productRoutesPromises = productItems.map(async (productItem) => {
    const { slug: productSlug } = productItem.attributes;

    // A. Fetch Single Pages linked to this Product (Overview, QuickStart, Lists)
    // ------------------------------------------------------------------------
    const singlePagesData = await fetchProductSinglePages(productSlug);
    const relations = singlePagesData.data[0]
      ?.attributes as unknown as SitemapProductRelations;

    const overviewRoute = relations?.overview?.data
      ? [
          {
            url: `${baseUrl}/${productSlug}/overview`,
            lastModified: new Date(
              relations.overview.data.attributes.updatedAt || Date.now()
            ),
            changeFrequency: 'weekly' as const,
            priority: 0.8,
          },
        ]
      : [];

    const quickStartRoute = relations?.quickstart_guide?.data
      ? [
          {
            url: `${baseUrl}/${productSlug}/quick-start`,
            lastModified: new Date(
              relations.quickstart_guide.data.attributes.updatedAt || Date.now()
            ),
            changeFrequency: 'weekly' as const,
            priority: 0.8,
          },
        ]
      : [];

    const tutorialListRoute = relations?.tutorial_list_page?.data
      ? [
          {
            url: `${baseUrl}/${productSlug}/tutorials`,
            lastModified: new Date(
              relations.tutorial_list_page.data.attributes.updatedAt ||
                Date.now()
            ),
            changeFrequency: 'weekly' as const,
            priority: 0.7,
          },
        ]
      : [];

    const guideListRoute = relations?.guide_list_page?.data
      ? [
          {
            url: `${baseUrl}/${productSlug}/guides`,
            lastModified: new Date(
              relations.guide_list_page.data.attributes.updatedAt || Date.now()
            ),
            changeFrequency: 'weekly' as const,
            priority: 0.6,
          },
        ]
      : [];

    // B. Fetch Collections linked to this Product (Tutorials, APIs)
    // ------------------------------------------------------------------------

    // Tutorials (Individual Pages)
    const tutorialsData = await fetchProductTutorials(productSlug);
    const tutorialRoutes = tutorialsData.data
      .filter((tutorial) => tutorial.attributes.slug)
      .map((tutorial) => ({
        url: `${baseUrl}/${productSlug}/tutorials/${tutorial.attributes.slug}`,
        lastModified: new Date(tutorial.attributes.updatedAt || Date.now()),
        changeFrequency: 'weekly' as const,
        priority: 0.6,
      }));

    // API Data (Individual Pages)
    const apisData = await fetchProductApiData(productSlug);
    const apiRoutes = (
      apisData.data as unknown as readonly SitemapApiData[]
    ).flatMap((api) => {
      const apiSlug =
        api.attributes.apiRestDetail?.slug ||
        api.attributes.apiSoapDetail?.slug;
      return apiSlug
        ? [
            {
              url: `${baseUrl}/${productSlug}/api/${apiSlug}`,
              lastModified: new Date(api.attributes.updatedAt || Date.now()),
              changeFrequency: 'weekly' as const,
              priority: 0.6,
            },
          ]
        : [];
    });

    return [
      ...overviewRoute,
      ...quickStartRoute,
      ...tutorialListRoute,
      ...guideListRoute,
      ...tutorialRoutes,
      ...apiRoutes,
    ];
  });

  const allProductRoutes = (await Promise.all(productRoutesPromises)).flat();

  // Combine Everything
  return [
    ...baseRoutes,
    ...sectionRoutes,
    ...caseHistoryRoutes,
    ...webinarRoutes,
    ...solutionRoutes,
    ...solutionsDetailRoutes,
    ...s3GuideRoutes,
    ...s3SolutionRoutes,
    ...s3ReleaseNoteRoutes,
    ...allProductRoutes,
  ];
}

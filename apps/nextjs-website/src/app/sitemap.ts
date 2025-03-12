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
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';

// S3 configuration
const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
});
const S3_BUCKET_NAME = process.env.S3_BUCKET_NAME || 'your-bucket-name';
const S3_GUIDE_METADATA_JSON_PATH =
  process.env.S3_GUIDE_METADATA_JSON_PATH || 'guides-metadata.json';

// Define interface for guide metadata
interface GuideMetadata {
  readonly path: string;
  readonly lastModified?: string;
  readonly title?: string;
  readonly product?: string;
  // Add other properties as needed
}

// Function to fetch guides metadata from S3
async function fetchGuidesMetadataFromS3(): Promise<readonly GuideMetadata[]> {
  // eslint-disable-next-line functional/no-try-statements
  try {
    const response = await s3Client.send(
      new GetObjectCommand({
        Bucket: S3_BUCKET_NAME,
        Key: S3_GUIDE_METADATA_JSON_PATH,
      })
    );

    // Convert stream to string
    const bodyContents = await response.Body?.transformToString();
    if (!bodyContents) {
      return [];
    }

    return JSON.parse(bodyContents) as readonly GuideMetadata[];
  } catch (error) {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Get dynamic paths
  const apiDataParams = await getApiDataParams();
  const guideListPages = await getGuideListPagesProps();
  const caseHistories = await getCaseHistoriesProps();
  const productSlugs = (await getProductsProps()).map(
    (product) => product.slug
  );

  // Fetch guides metadata from S3
  const guidesMetadata = await fetchGuidesMetadataFromS3();

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

  // Generate routes for guides from S3 metadata
  const s3GuideRoutes = guidesMetadata.map((guide: GuideMetadata) => ({
    url: `${baseUrl}${guide.path}`,
    lastModified: new Date(guide.lastModified || new Date().toISOString()),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  return [
    ...routes,
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
    ...s3GuideRoutes,
  ];
}

import { StrapiOverviews } from '@/lib/strapi/types/overviews';
import { strapiOverviews } from '@/lib/strapi/__tests__/fixtures/overviews';

export function minimalDataSingleOverview(): StrapiOverviews {
  return {
    ...strapiOverviews,
    data: [
      {
        ...strapiOverviews.data[0],
        attributes: {
          ...strapiOverviews.data[0].attributes,
          features: undefined,
          startInfoSection: undefined,
          tutorialSection: undefined,
          whatsNew: undefined,
          postIntegration: undefined,
          relatedLinks: undefined,
          seo: undefined,
        },
      },
    ],
  };
}

import { mediaJpeg } from '@/lib/strapi/__tests__/factories/media';
import { strapiCaseHistories } from '@/lib/strapi/__tests__/fixtures/caseHistories';
import { StrapiCaseHistories } from '@/lib/strapi/types/caseHistories';
import { StrapiBaseProductWithoutBannerLinks } from '@/lib/strapi/types/product';

export function minimalDataCaseHistories() {
  const strapiCaseHistory = strapiCaseHistories.data[0];
  return {
    ...strapiCaseHistories,
    data: [
      {
        ...strapiCaseHistory,
        title: 'Minimal Data Case History',
        slug: 'minimal-data-case-history',
        description: undefined,
        publishedAt: '2023-01-02T00:00:00.000Z',
        updatedAt: '2023-01-02T00:00:00.000Z',
        image: undefined,
        parts: [],
        seo: undefined,
      },
    ],
  } satisfies StrapiCaseHistories;
}

export function caseHistoriesWithMissingData() {
  const strapiCaseHistory = strapiCaseHistories.data[0];
  return {
    ...strapiCaseHistories,
    ...[
      {
        ...strapiCaseHistory,
        title: undefined,
        slug: undefined,
        publishedAt: undefined,
        updatedAt: undefined,
      },
    ],
  };
}

export function caseHistoryWithMissingMandatoryData() {
  const strapiCaseHistory = caseHistoriesWithMissingData().data[0];
  return {
    ...strapiCaseHistories,
    data: [
      {
        ...strapiCaseHistory,
        products: [],
      },
    ],
  };
}

export function caseHistoriesWithMultipleProducts() {
  const strapiCaseHistory = strapiCaseHistories.data[0];
  const secondProduct = {
    isVisible: true,
    name: 'Second Product',
    shortName: 'SecondProd',
    slug: 'second-product',
    logo: mediaJpeg(),
  };

  return {
    ...strapiCaseHistories,
    data: [
      {
        ...strapiCaseHistory,
        products: [
          ...strapiCaseHistory.products,
          secondProduct,
        ] as readonly StrapiBaseProductWithoutBannerLinks[],
      },
    ],
  } satisfies StrapiCaseHistories;
}

export function caseHistoriesWithoutImage() {
  const strapiCaseHistory = strapiCaseHistories.data[0];
  return {
    ...strapiCaseHistories,
    data: [
      {
        ...strapiCaseHistory,
        image: undefined,
      },
    ],
  } satisfies StrapiCaseHistories;
}

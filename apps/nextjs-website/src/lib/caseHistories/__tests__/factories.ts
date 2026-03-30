import { mediaJpeg } from '@/lib/media/__tests__/factories';
import { strapiCaseHistories } from '@/lib/caseHistories/__tests__/fixtures';
import { CaseHistories } from '@/lib/caseHistories/types';
import { StrapiBaseProductWithoutBannerLinks } from '@/lib/products/strapiTypes';

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
  } satisfies CaseHistories;
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
  } satisfies CaseHistories;
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
  } satisfies CaseHistories;
}

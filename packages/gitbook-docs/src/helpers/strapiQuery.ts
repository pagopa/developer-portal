import qs from 'qs';

const STRAPI_PAGE_SIZE = 250; // To increase page size over 250 strapi configuration must be updated by default this is the max limit

const STRAPI_DEFAULT_PAGINATION = {
  pagination: {
    pageSize: STRAPI_PAGE_SIZE,
    page: 1,
  },
};

const productRelationsPopulate = {
  populate: [
    'logo',
    'bannerLinks.icon',
    'overview',
    'quickstart_guide',
    'release_note',
    'api_data_list_page',
    'api_data_list_page.api_data',
    'api_data_list_page.api_data.apiRestDetail',
    'guide_list_page',
    'tutorial_list_page',
    'use_case_list_page',
  ],
};

const webinarPopulate = {
  populate: '*',
};

const guidesPopulate = {
  populate: {
    image: { populate: '*' },
    mobileImage: { populate: '*' },
    listItems: { populate: '*' },
    versions: { populate: '*' },
    bannerLinks: { populate: ['icon'] },
    seo: { populate: '*' },
    product: {
      ...productRelationsPopulate,
    },
  },
};

const guidesQueryParams = {
  ...guidesPopulate,
  ...STRAPI_DEFAULT_PAGINATION,
};

const releaseNotesPopulate = {
  populate: {
    bannerLinks: {
      populate: ['*'],
    },
    product: {
      populate: [
        'logo',
        'bannerLinks',
        'overview',
        'quickstart_guide',
        'release_note',
        'api_data_list_page',
        'api_data_list_page.api_data',
        'api_data_list_page.api_data.apiRestDetail',
        'api_data_list_page.api_data.apiRestDetail.specUrls',
        'api_data_list_page.api_data.apiSoapDetail',
        'guide_list_page',
        'tutorial_list_page',
        'use_case_list_page',
      ],
    },
    seo: {
      populate: '*',
    },
  },
};

const releaseNotesQueryParams = {
  ...releaseNotesPopulate,
  ...STRAPI_DEFAULT_PAGINATION,
};

const solutionsPopulate = {
  populate: {
    icon: {
      populate: '*',
    },
    stats: '*',
    steps: {
      populate: {
        products: {
          populate: '*',
        },
      },
    },
    seo: {
      populate: '*',
    },
    products: {
      populate: '*',
    },
    bannerLinks: {
      populate: ['*'],
    },
    webinars: {
      ...webinarPopulate,
    },
    caseHistories: {
      populate: ['case_histories', 'case_histories.image'],
    },
  },
};

const solutionsQueryParams = {
  ...solutionsPopulate,
  ...STRAPI_DEFAULT_PAGINATION,
};

const productsQueryParams = {
  ...STRAPI_DEFAULT_PAGINATION,
};

const apisDataPopulate = {
  populate: {
    product: {
      populate: '*',
    },
    apiRestDetail: {
      populate: {
        specUrls: {
          populate: '*',
        },
      },
    },
    apiSoapDetail: {
      populate: '*',
    },
  },
};

const apisDataQueryParams = {
  ...apisDataPopulate,
  ...STRAPI_DEFAULT_PAGINATION,
};

const guideListPagesPopulate = {
  populate: {
    product: {
      ...productRelationsPopulate,
    },
    guidesByCategory: {
      populate: {
        guides: {
          populate: ['mobileImage', 'image', 'listItems'],
        },
      },
    },
    bannerLinks: {
      populate: ['*'],
    },
    seo: {
      populate: '*',
    },
  },
};

const guideListPagesQueryParams = {
  ...guideListPagesPopulate,
  ...STRAPI_DEFAULT_PAGINATION,
};

const solutionListPagePopulate = {
  populate: {
    solutions: {
      populate: [
        'bannerLinks',
        'products.logo',
        'icon',
        'stats',
        'steps',
        'steps.products',
        'webinars',
        'webinars.coverImage',
        'caseHistories',
        'caseHistories.case_histories',
        'caseHistories.case_histories.image',
      ],
    },
    caseHistories: {
      populate: ['case_histories', 'case_histories.image'],
    },
    features: {
      populate: ['items.icon'],
    },
    seo: {
      populate: '*',
    },
  },
};

const solutionListPageQueryParams = {
  ...solutionListPagePopulate,
  ...STRAPI_DEFAULT_PAGINATION,
};

export const guidesQueryString = qs.stringify(guidesQueryParams);
export const solutionsQueryString = qs.stringify(solutionsQueryParams);
export const productsQueryString = qs.stringify(productsQueryParams);
export const apisDataQueryString = qs.stringify(apisDataQueryParams);
export const releaseNotesQueryString = qs.stringify(releaseNotesQueryParams);
export const guideListPagesQueryString = qs.stringify(
  guideListPagesQueryParams
);
export const solutionListPageQueryString = qs.stringify(
  solutionListPageQueryParams
);

/**
 * Generate query strings with optional dirName filtering.
 *
 * NOTE: For guides, filtering by versions.dirName is not possible server-side because
 * 'versions' is a repeatable component field. While Strapi v4 documentation doesn't
 * explicitly prohibit filtering on components, testing confirmed it doesn't work
 * for nested properties within repeatable components (filters[versions][dirName] returns no results).
 * Client-side filtering must be applied after fetching all guides.
 *
 * Reference: https://docs-v4.strapi.io/dev-docs/api/rest/filters-locale-publication
 * (Strapi docs confirm filtering limitations on dynamic zones and media fields, but don't
 * explicitly document repeatable component filtering behavior)
 */
export function getSolutionsQueryString(dirNames?: readonly string[]): string {
  const params = {
    ...solutionsQueryParams,
    ...(dirNames && dirNames.length > 0
      ? {
          filters: {
            dirName: {
              $in: dirNames,
            },
          },
        }
      : {}),
  };
  return qs.stringify(params);
}

export function getReleaseNotesQueryString(
  dirNames?: readonly string[]
): string {
  const params = {
    ...releaseNotesQueryParams,
    ...(dirNames && dirNames.length > 0
      ? {
          filters: {
            dirName: {
              $in: dirNames,
            },
          },
        }
      : {}),
  };
  return qs.stringify(params);
}

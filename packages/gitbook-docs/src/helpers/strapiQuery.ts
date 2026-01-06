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
    'api_data_list_page.apiData.*',
    'api_data_list_page.apiData.apiRestDetail.*',
    'guide_list_page',
    'tutorial_list_page',
    'use_case_list_page',
  ],
};

const webinarPopulate = {
  populate: {
    coverImage: {
      populate: ['image'],
    },
    webinarSpeakers: {
      populate: ['avatar'],
    },
    relatedLinks: {
      populate: ['links'],
    },
    relatedResources: {
      populate: {
        resources: {
          populate: ['image'],
        },
        downloadableDocuments: {
          populate: '*',
        },
      },
    },
    seo: {
      populate: '*,metaImage,metaSocial.image',
    },
    questionsAndAnswers: '*',
    webinarCategory: {
      populate: ['icon'],
    },
    headerImage: {
      populate: ['image'],
    },
  },
};

const guidesPopulate = {
  populate: {
    image: { populate: '*' },
    mobileImage: { populate: '*' },
    listItems: { populate: '*' },
    versions: { populate: '*' },
    bannerLinks: { populate: ['icon'] },
    seo: { populate: '*,metaImage,metaSocial.image' },
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
      populate: ['icon'],
    },
    product: {
      populate: [
        'logo',
        'bannerLinks.icon',
        'overview',
        'quickstart_guide',
        'release_note',
        'api_data_list_page',
        'api_data_list_page.apiData.*',
        'api_data_list_page.apiData.apiRestDetail.slug',
        'api_data_list_page.apiData.apiRestDetail.specUrls',
        'api_data_list_page.apiData.apiSoapDetail.*',
        'guide_list_page',
        'tutorial_list_page',
        'use_case_list_page',
      ],
    },
    seo: {
      populate: '*,metaImage,metaSocial.image',
    },
  },
};

const releaseNotesQueryParams = {
  ...releaseNotesPopulate,
  ...STRAPI_DEFAULT_PAGINATION,
};

const solutionsPopulate = {
  populate: {
    icon: 'icon',
    stats: '*',
    steps: {
      populate: {
        products: '*',
      },
    },
    seo: {
      populate: '*,metaImage,metaSocial.image',
    },
    products: {
      populate: ['logo'],
    },
    bannerLinks: {
      populate: ['icon'],
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
      populate: ['icon'],
    },
    seo: {
      populate: '*,metaImage,metaSocial.image',
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
        'bannerLinks.icon',
        'products.logo',
        'icon',
        'icon.name',
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
      populate: '*,metaImage,metaSocial.image',
    },
  },
};

const solutionListPageQueryParams = {
  ...solutionListPagePopulate,
  ...STRAPI_DEFAULT_PAGINATION,
};

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
 * Generate query string for guides with optional dirName filtering.
 * Uses deep filtering on the 'versions' component.
 */
export function getGuidesQueryString(dirNames?: readonly string[]): string {
  const params = {
    ...guidesQueryParams,
    ...(dirNames && dirNames.length > 0
      ? {
        filters: {
          versions: {
            dirName: {
              $in: dirNames,
            },
          },
        },
      }
      : {}),
  };
  return qs.stringify(params);
}

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

import qs from 'qs';

const STRAPI_PAGE_SIZE = 1000;

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

import { strapiApiDataListPages } from '@/lib/strapi/__tests__/fixtures/apiDataListPages';
import { StrapiApiDataListPages } from '@/lib/strapi/types/apiDataListPages';

export function minimalApiDataListPages(): StrapiApiDataListPages {
  const page = strapiApiDataListPages.data[0];
  return {
    data: [
      {
        ...page,
        attributes: {
          ...page.attributes,
          title: 'Minimal API List Page',
          description: undefined,
          seo: undefined,
          bannerLinks: [],
          apiData: {
            data: [
              {
                id: 1,
                attributes: {
                  title: 'Minimal API',
                  description: undefined,
                  icon: { data: undefined },
                  apiRestDetail: {
                    slug: 'minimal-api',
                    specUrls: [],
                  },
                  apiSoapDetail: undefined,
                  tags: { data: undefined },
                },
              },
            ],
          },
        },
      },
    ],
  };
}

export function apiDataListPageWithEmptyApiData(): StrapiApiDataListPages {
  const page = strapiApiDataListPages.data[0];
  return {
    data: [
      {
        ...page,
        attributes: {
          ...page.attributes,
          title: 'Empty API List Page',
          apiData: {
            data: [],
          },
        },
      },
    ],
  };
}

export function apiDataListPageWithMixedApiTypes(): StrapiApiDataListPages {
  const page = strapiApiDataListPages.data[0];
  return {
    data: [
      {
        ...page,
        attributes: {
          ...page.attributes,
          title: 'Mixed API Types Page',
          apiData: {
            data: [
              // Valid REST API
              {
                id: 1,
                attributes: {
                  title: 'REST API',
                  description: 'A REST API',
                  icon: { data: undefined },
                  apiRestDetail: {
                    slug: 'rest-api',
                    specUrls: [],
                  },
                  apiSoapDetail: undefined,
                  tags: { data: undefined },
                },
              },
              // Valid SOAP API
              {
                id: 2,
                attributes: {
                  title: 'SOAP API',
                  description: 'A SOAP API',
                  icon: { data: undefined },
                  apiRestDetail: undefined,
                  apiSoapDetail: {
                    slug: 'soap-api',
                    repositoryUrl: 'https://example.com/soap',
                    dirName: 'soap',
                  },
                  tags: { data: undefined },
                },
              },
              // Invalid API (no details)
              {
                id: 3,
                attributes: {
                  title: 'Invalid API',
                  description: 'An invalid API',
                  icon: { data: undefined },
                  apiRestDetail: undefined,
                  apiSoapDetail: undefined,
                  tags: { data: undefined },
                },
              },
            ],
          },
        },
      },
    ],
  };
}

export function apiDataListPageWithoutDescription(): StrapiApiDataListPages {
  const page = strapiApiDataListPages.data[0];
  return {
    data: [
      {
        ...page,
        attributes: {
          ...page.attributes,
          description: undefined,
        },
      },
    ],
  };
}

export function apiDataListPageWithInvalidApiData(): StrapiApiDataListPages {
  const page = strapiApiDataListPages.data[0];
  return {
    data: [
      {
        ...page,
        attributes: {
          ...page.attributes,
          title: 'Invalid API Data Page',
          apiData: {
            data: [
              {
                id: 1,
                attributes: {
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  title: undefined as any,
                  description: 'API without title',
                  icon: { data: undefined },
                  apiRestDetail: {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    slug: undefined as any,
                    specUrls: [],
                  },
                  apiSoapDetail: undefined,
                  tags: { data: undefined },
                },
              },
              // API without any details
              {
                id: 2,
                attributes: {
                  title: 'API without details',
                  description: 'This API has no REST or SOAP details',
                  icon: { data: undefined },
                  apiRestDetail: undefined,
                  apiSoapDetail: undefined,
                  tags: { data: undefined },
                },
              },
            ],
          },
        },
      },
    ],
  };
}

export function multipleApiDataListPages(): StrapiApiDataListPages {
  const page = strapiApiDataListPages.data[0];
  return {
    data: [
      page,
      {
        ...page,
        id: 2,
        attributes: {
          ...page.attributes,
          title: 'Second API List Page',
          description: 'Another API list page',
          apiData: {
            data: [
              {
                id: 10,
                attributes: {
                  title: 'Another REST API',
                  description: 'Another REST API description',
                  icon: { data: undefined },
                  apiRestDetail: {
                    slug: 'another-rest-api',
                    specUrls: [],
                  },
                  apiSoapDetail: undefined,
                  tags: { data: undefined },
                },
              },
            ],
          },
        },
      },
    ],
  };
}

export function emptyApiDataListPages(): StrapiApiDataListPages {
  return {
    data: [],
  };
}

export function apiDataListPageWithBothRestAndSoap(): StrapiApiDataListPages {
  const page = strapiApiDataListPages.data[0];
  return {
    data: [
      {
        ...page,
        attributes: {
          ...page.attributes,
          apiData: {
            data: [
              {
                id: 1,
                attributes: {
                  title: 'API with both REST and SOAP',
                  description: 'API with both details',
                  icon: { data: undefined },
                  apiRestDetail: {
                    slug: 'rest-slug',
                    specUrls: [],
                  },
                  apiSoapDetail: {
                    slug: 'soap-slug',
                    repositoryUrl: 'https://example.com',
                    dirName: 'soap',
                  },
                  tags: { data: undefined },
                },
              },
            ],
          },
        },
      },
    ],
  };
}

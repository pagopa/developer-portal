import { strapiApiDataListPages } from '@/lib/strapi/__tests__/fixtures/apiDataListPages';
import { StrapiApiDataListPages } from '@/lib/strapi/types/apiDataListPages';

export function minimalApiDataListPages(): StrapiApiDataListPages {
  const page = strapiApiDataListPages[0];
  return [
    {
      ...page,
      title: 'Minimal API List Page',
      description: undefined,
      seo: undefined,
      bannerLinks: [],
      api_data: [
        {
          id: 1,
          title: 'Minimal API',
          description: undefined,
          icon: undefined,
          apiRestDetail: {
            slug: 'minimal-api',
            specUrls: [],
          },
          apiSoapDetail: undefined,
          tags: undefined,
          bannerLinks: [],
        },
      ],
    },
  ];
}

export function apiDataListPageWithEmptyApiData(): StrapiApiDataListPages {
  const page = strapiApiDataListPages[0];
  return [
    {
      ...page,
      title: 'Empty API List Page',
      api_data: [],
    },
  ];
}

export function apiDataListPageWithMixedApiTypes(): StrapiApiDataListPages {
  const page = strapiApiDataListPages[0];
  return [
    {
      ...page,
      title: 'Mixed API Types Page',
      api_data: [
        // Valid REST API
        {
          id: 1,
          bannerLinks: [],
          title: 'REST API',
          description: 'A REST API',
          icon: undefined,
          apiRestDetail: {
            slug: 'rest-api',
            specUrls: [],
          },
          apiSoapDetail: undefined,
          tags: undefined,
        },
        // Valid SOAP API
        {
          id: 2,
          bannerLinks: [],
          title: 'SOAP API',
          description: 'A SOAP API',
          icon: undefined,
          apiRestDetail: undefined,
          apiSoapDetail: {
            slug: 'soap-api',
            repositoryUrl: 'https://example.com/soap',
            dirName: 'soap',
          },
          tags: undefined,
        },
        // Invalid API (no details)
        {
          id: 3,
          bannerLinks: [],
          title: 'Invalid API',
          description: 'An invalid API',
          icon: undefined,
          apiRestDetail: undefined,
          apiSoapDetail: undefined,
          tags: undefined,
        },
      ],
    },
  ];
}

export function apiDataListPageWithoutDescription(): StrapiApiDataListPages {
  const page = strapiApiDataListPages[0];
  return [
    {
      ...page,
      description: undefined,
    },
  ];
}

export function apiDataListPageWithInvalidApiData(): StrapiApiDataListPages {
  const page = strapiApiDataListPages[0];
  return [
    {
      ...page,
      title: 'Invalid API Data Page',
      api_data: [
        {
          id: 1,
          bannerLinks: [],
          title: undefined as any,
          description: 'API without title',
          icon: undefined,
          apiRestDetail: {
            slug: undefined as any,
            specUrls: [],
          },
          apiSoapDetail: undefined,
          tags: undefined,
        },
        // API without any details
        {
          id: 2,
          bannerLinks: [],
          title: 'API without details',
          description: 'This API has no REST or SOAP details',
          icon: undefined,
          apiRestDetail: undefined,
          apiSoapDetail: undefined,
          tags: undefined,
        },
      ],
    },
  ];
}

export function multipleApiDataListPages(): StrapiApiDataListPages {
  const page = strapiApiDataListPages[0];
  return [
    page,
    {
      ...page,
      id: 2,
      title: 'Second API List Page',
      description: 'Another API list page',
      api_data: [
        {
          id: 10,
          bannerLinks: [],
          title: 'Another REST API',
          description: 'Another REST API description',
          icon: undefined,
          apiRestDetail: {
            slug: 'another-rest-api',
            specUrls: [],
          },
          apiSoapDetail: undefined,
          tags: undefined,
        },
      ],
    },
  ];
}

export function emptyApiDataListPages(): StrapiApiDataListPages {
  return [];
}

export function apiDataListPageWithBothRestAndSoap(): StrapiApiDataListPages {
  const page = strapiApiDataListPages[0];
  return [
    {
      ...page,
      api_data: [
        {
          id: 1,
          bannerLinks: [],
          title: 'API with both REST and SOAP',
          description: 'API with both details',
          icon: undefined,
          apiRestDetail: {
            slug: 'rest-slug',
            specUrls: [],
          },
          apiSoapDetail: {
            slug: 'soap-slug',
            repositoryUrl: 'https://example.com',
            dirName: 'soap',
          },
          tags: undefined,
        },
      ],
    },
  ];
}

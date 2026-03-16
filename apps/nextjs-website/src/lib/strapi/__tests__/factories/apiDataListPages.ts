import { strapiApiDataListPages } from '@/lib/strapi/__tests__/fixtures/apiDataListPages';
import {
  ApiDataListPage,
  ApiDataListPages,
} from '@/lib/apiDataListPages/types';
import { wrapAsRootEntity } from '../strapiEntityWrappers';

export function minimalApiDataListPages(): ApiDataListPages {
  const page = strapiApiDataListPages.data[0];
  return wrapAsRootEntity<readonly ApiDataListPage[]>([
    {
      ...page,
      title: 'Minimal API List Page',
      description: undefined,
      seo: undefined,
      bannerLinks: [],
      apiData: [
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
  ]);
}

export function apiDataListPageWithEmptyApiData(): ApiDataListPages {
  const page = strapiApiDataListPages.data[0];
  return wrapAsRootEntity<readonly ApiDataListPage[]>([
    {
      ...page,
      title: 'Empty API List Page',
      apiData: [],
    },
  ]);
}

export function apiDataListPageWithMixedApiTypes(): ApiDataListPages {
  const page = strapiApiDataListPages.data[0];
  return wrapAsRootEntity<readonly ApiDataListPage[]>([
    {
      ...page,
      title: 'Mixed API Types Page',
      apiData: [
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
  ]);
}

export function apiDataListPageWithoutDescription(): ApiDataListPages {
  const page = strapiApiDataListPages.data[0];
  return wrapAsRootEntity<readonly ApiDataListPage[]>([
    {
      ...page,
      description: undefined,
    },
  ]);
}

export function apiDataListPageWithInvalidApiData(): ApiDataListPages {
  const page = strapiApiDataListPages.data[0];
  return wrapAsRootEntity<readonly ApiDataListPage[]>([
    {
      ...page,
      title: 'Invalid API Data Page',
      apiData: [
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
  ]);
}

export function multipleApiDataListPages(): ApiDataListPages {
  const page = strapiApiDataListPages.data[0];
  return wrapAsRootEntity<readonly ApiDataListPage[]>([
    page,
    {
      ...page,
      id: 2,
      title: 'Second API List Page',
      description: 'Another API list page',
      apiData: [
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
  ]);
}

export function emptyApiDataListPages(): ApiDataListPages {
  return wrapAsRootEntity<readonly ApiDataListPage[]>([]);
}

export function apiDataListPageWithBothRestAndSoap(): ApiDataListPages {
  const page = strapiApiDataListPages.data[0];
  return wrapAsRootEntity<readonly ApiDataListPage[]>([
    {
      ...page,
      apiData: [
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
  ]);
}

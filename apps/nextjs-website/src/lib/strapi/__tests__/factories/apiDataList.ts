/* eslint-disable @typescript-eslint/no-explicit-any */
import { strapiApiDataList } from '@/lib/strapi/__tests__/fixtures/apiDataList';
import { StrapiApiDataList } from '@/lib/strapi/types/apiDataList';

export function minimalApiDataList() {
  const apiData = strapiApiDataList.data[0];
  return {
    ...strapiApiDataList,
    data: [
      {
        ...apiData,
        title: 'Minimal API Data',
        description: undefined,
        seo: undefined,
        bannerLinks: [],
        product: {
          data: {
            name: 'Minimal',
            shortName: 'Min',
            slug: 'minimal',
            isVisible: true,
            overview: apiData.product.data!.overview,
            quickstart_guide: apiData.product.data!.quickstart_guide,
            api_data_list_page: apiData.product.data!.api_data_list_page,
            tutorial_list_page: apiData.product.data!.tutorial_list_page,
            guide_list_page: apiData.product.data!.guide_list_page,
            release_note: apiData.product.data!.release_note,
            use_case_list_page: apiData.product.data!.use_case_list_page,
            tags: apiData.product.data!.tags,
            bannerLinks: undefined,
          },
        },
        apiRestDetail: {
          slug: 'minimal-api',
          specUrls: [
            {
              id: 1,
              url: 'https://example.com/api.yaml',
              name: undefined,
              hideTryIt: false,
            },
          ],
        },
        apiSoapDetail: undefined,
      },
    ],
  } satisfies StrapiApiDataList;
}

export function apiDataWithoutBannerLinks() {
  const apiData = strapiApiDataList.data[0];
  return {
    ...strapiApiDataList,
    data: [
      {
        ...apiData,
        bannerLinks: [],
      },
    ],
  } satisfies StrapiApiDataList;
}

export function apiDataWithMissingProduct() {
  const apiData = strapiApiDataList.data[0];
  return {
    ...strapiApiDataList,
    data: [
      {
        ...apiData,
        title: 'API Data Without Product',
        product: {
          data: undefined as any,
        },
      },
    ],
  } satisfies StrapiApiDataList;
}

export function apiDataWithoutApiDetails() {
  const apiData = strapiApiDataList.data[0];
  return {
    ...strapiApiDataList,
    data: [
      {
        ...apiData,
        title: 'API Data Without API Details',
        apiRestDetail: undefined,
        apiSoapDetail: undefined,
      },
    ],
  } satisfies StrapiApiDataList;
}

export function apiDataWithInvalidRestApiDetails() {
  const apiData = strapiApiDataList.data[0];
  return {
    ...strapiApiDataList,
    data: [
      {
        ...apiData,
        title: 'API Data Without API Details',
        apiRestDetail: {
          slug: '',
          specUrls: [],
        },
        apiSoapDetail: undefined,
      },
    ],
  } satisfies StrapiApiDataList;
}

export function apiDatalistWithItemMissingSlug() {
  const apiData = strapiApiDataList.data[0];
  return {
    ...strapiApiDataList,
    data: [
      {
        ...apiData,
        title: 'API Data Without API Details',
        apiRestDetail: undefined,
        apiSoapDetail: {
          slug: undefined as any,
          repositoryUrl: 'https://example.com/soap.wsdl',
          dirName: 'soap-dir',
        },
      },
    ],
  } satisfies StrapiApiDataList;
}

export function mixedApiDataValidAndInvalid() {
  const validRestApi = strapiApiDataList.data[0];
  const validSoapApi = strapiApiDataList.data[1];
  const invalidApi = apiDataWithoutApiDetails().data[0];
  const invalidProductApi = apiDataWithMissingProduct().data[0];

  return {
    ...strapiApiDataList,
    data: [
      validRestApi,
      invalidApi,
      validSoapApi,
      invalidProductApi,
      {
        ...validRestApi,
        id: 5,
        title: 'Another Valid REST API',
        apiRestDetail: {
          slug: 'another-valid-rest-api',
          specUrls: [
            {
              id: 5,
              url: 'https://example.com/another-api.yaml',
              name: 'Another API',
              hideTryIt: false,
            },
          ],
        },
      },
    ],
  } satisfies StrapiApiDataList;
}

export function apiDataWithoutProductBannerLinks() {
  const apiData = strapiApiDataList.data[0];
  return {
    ...strapiApiDataList,
    data: [
      {
        ...apiData,
        bannerLinks: [],
        product: {
          data: {
            ...apiData.product.data,
            name: apiData.product.data?.name || '',
            shortName: apiData.product.data?.shortName || '',
            slug: apiData.product.data?.slug || '',
            isVisible: apiData.product.data?.isVisible || false,
            overview: apiData.product.data!.overview,
            quickstart_guide: apiData.product.data!.quickstart_guide,
            api_data_list_page: apiData.product.data!.api_data_list_page,
            tutorial_list_page: apiData.product.data!.tutorial_list_page,
            guide_list_page: apiData.product.data!.guide_list_page,
            release_note: apiData.product.data!.release_note,
            use_case_list_page: apiData.product.data!.use_case_list_page,
            tags: apiData.product.data!.tags,
            bannerLinks: [],
          },
        },
      },
    ],
  } satisfies StrapiApiDataList;
}

export function apiDataWithCorruptedProduct() {
  const apiData = strapiApiDataList.data[0];
  return {
    ...strapiApiDataList,
    data: [
      {
        ...apiData,
        title: 'API Data With Corrupted Product',
        product: {
          data: {
            ...apiData.product.data,
          },
        },
      },
    ],
  };
}

export function allInvalidApiData() {
  return {
    ...strapiApiDataList,
    data: [
      apiDataWithoutApiDetails().data[0],
      apiDataWithMissingProduct().data[0],
      apiDataWithCorruptedProduct().data[0],
    ],
  };
}

export function soapApiDataOnly() {
  const soapApi = strapiApiDataList.data[1];
  return {
    ...strapiApiDataList,
    data: [soapApi],
  } satisfies StrapiApiDataList;
}

export function restApiDataOnly() {
  const restApi = strapiApiDataList.data[0];
  return {
    ...strapiApiDataList,
    data: [restApi],
  } satisfies StrapiApiDataList;
}

export function restApiDataWithMultipleSpecs() {
  const restApi = strapiApiDataList.data[0];
  return {
    ...strapiApiDataList,
    data: [
      {
        ...restApi,
        apiRestDetail: {
          slug: 'multi-spec-api',
          specUrls: [
            {
              id: 1,
              url: 'https://example.com/api1.yaml',
              name: 'API 1',
              hideTryIt: false,
            },
            {
              id: 2,
              url: 'https://example.com/api2.yaml',
              name: 'API 2',
              hideTryIt: true,
            },
          ],
        },
      },
    ],
  } satisfies StrapiApiDataList;
}

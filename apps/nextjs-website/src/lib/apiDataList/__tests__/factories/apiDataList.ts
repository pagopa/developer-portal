/* eslint-disable @typescript-eslint/no-explicit-any */
import { strapiApiDataList } from '@/lib/apiDataList/__tests__/fixtures/apiDataList';
import { ApiData } from '@/lib/apiDataList/types';
import { wrapAsRootEntity } from '@/lib/__tests__/strapiEntityWrappers';

export function minimalApiDataList() {
  const apiData = strapiApiDataList.data[0];
  return wrapAsRootEntity([
    {
      ...apiData,
      title: 'Minimal API Data',
      description: undefined,
      seo: undefined,
      bannerLinks: [],
      product: {
        name: 'Minimal',
        shortName: 'Min',
        slug: 'minimal',
        isVisible: true,
        overview: apiData.product?.overview,
        quickstart_guide: apiData.product?.quickstart_guide,
        api_data_list_page: apiData.product?.api_data_list_page,
        tutorial_list_page: apiData.product?.tutorial_list_page,
        guide_list_page: apiData.product?.guide_list_page,
        release_note: apiData.product?.release_note,
        use_case_list_page: apiData.product?.use_case_list_page,
        tags: apiData.product?.tags,
        bannerLinks: undefined,
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
    } satisfies ApiData,
  ]);
}

export function apiDataWithoutBannerLinks() {
  const apiData = strapiApiDataList.data[0];
  return wrapAsRootEntity([
    {
      ...apiData,
      bannerLinks: [],
    } satisfies ApiData,
  ]);
}

export function apiDataWithMissingProduct() {
  const apiData = strapiApiDataList.data[0];
  return wrapAsRootEntity([
    {
      ...apiData,
      title: 'API Data Without Product',
      product: undefined,
    },
  ] as readonly ApiData[]);
}

export function apiDataWithoutApiDetails() {
  const apiData = strapiApiDataList.data[0];
  return wrapAsRootEntity([
    {
      ...apiData,
      title: 'API Data Without API Details',
      apiRestDetail: undefined,
      apiSoapDetail: undefined,
    } satisfies ApiData,
  ]);
}

export function apiDataWithInvalidRestApiDetails() {
  const apiData = strapiApiDataList.data[0];
  return wrapAsRootEntity([
    {
      ...apiData,
      title: 'API Data Without API Details',
      apiRestDetail: {
        slug: '',
        specUrls: [],
      },
      apiSoapDetail: undefined,
    } satisfies ApiData,
  ]);
}

export function apiDatalistWithItemMissingSlug() {
  const apiData = strapiApiDataList.data[0];
  return wrapAsRootEntity([
    {
      ...apiData,
      title: 'API Data Without API Details',
      apiRestDetail: undefined,
      apiSoapDetail: {
        slug: undefined as any,
        repositoryUrl: 'https://example.com/soap.wsdl',
        dirName: 'soap-dir',
      },
    } satisfies ApiData,
  ]);
}

export function mixedApiDataValidAndInvalid() {
  const validRestApi = strapiApiDataList.data[0];
  const validSoapApi = strapiApiDataList.data[1];
  const invalidApi = apiDataWithoutApiDetails().data[0];
  const invalidProductApi = apiDataWithMissingProduct().data[0];

  return wrapAsRootEntity([
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
    } satisfies ApiData,
  ]);
}

export function apiDataWithoutProductBannerLinks() {
  const apiData = strapiApiDataList.data[0];
  return wrapAsRootEntity([
    {
      ...apiData,
      bannerLinks: [],
      product: {
        ...apiData.product,
        name: apiData.product?.name || '',
        shortName: apiData.product?.shortName || '',
        slug: apiData.product?.slug || '',
        isVisible: apiData.product?.isVisible || false,
        overview: apiData.product?.overview,
        quickstart_guide: apiData.product?.quickstart_guide,
        api_data_list_page: apiData.product?.api_data_list_page,
        tutorial_list_page: apiData.product?.tutorial_list_page,
        guide_list_page: apiData.product?.guide_list_page,
        release_note: apiData.product?.release_note,
        use_case_list_page: apiData.product?.use_case_list_page,
        tags: apiData.product?.tags,
        bannerLinks: [],
      },
    } satisfies ApiData,
  ]);
}

export function apiDataWithCorruptedProduct() {
  const apiData = strapiApiDataList.data[0];
  return wrapAsRootEntity([
    {
      ...apiData,
      title: 'API Data With Corrupted Product',
      product: undefined as any,
    } satisfies ApiData,
  ]);
}

export function allInvalidApiData() {
  return wrapAsRootEntity([
    apiDataWithoutApiDetails().data[0],
    apiDataWithMissingProduct().data[0],
    apiDataWithCorruptedProduct().data[0],
  ]);
}

export function soapApiDataOnly() {
  const soapApi = strapiApiDataList.data[1];
  return wrapAsRootEntity([soapApi satisfies ApiData]);
}

export function restApiDataOnly() {
  const restApi = strapiApiDataList.data[0];
  return wrapAsRootEntity([restApi satisfies ApiData]);
}

export function restApiDataWithMultipleSpecs() {
  const restApi = strapiApiDataList.data[0];
  return wrapAsRootEntity([
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
    } satisfies ApiData,
  ]);
}

/* eslint-disable @typescript-eslint/no-explicit-any */
import { strapiApiDataList } from '@/lib/strapi/__tests__/fixtures/apiDataList';
import { StrapiApiDataList } from '@/lib/strapi/types/apiDataList';
import { wrapAsRootEntity } from '@/lib/strapi/__tests__/strapiEntityWrappers';

export function minimalApiDataList() {
  const apiData = strapiApiDataList.data[0];
  return wrapAsRootEntity<StrapiApiDataList>([
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
    },
  ] as StrapiApiDataList);
}

export function apiDataWithoutBannerLinks() {
  const apiData = strapiApiDataList.data[0];
  return wrapAsRootEntity<StrapiApiDataList>([
    {
      ...apiData,
      bannerLinks: [],
    },
  ] as StrapiApiDataList);
}

export function apiDataWithMissingProduct() {
  const apiData = strapiApiDataList.data[0];
  return wrapAsRootEntity<StrapiApiDataList>([
    {
      ...apiData,
      title: 'API Data Without Product',
      product: undefined,
    },
  ] as StrapiApiDataList);
}

export function apiDataWithoutApiDetails() {
  const apiData = strapiApiDataList.data[0];
  return wrapAsRootEntity<StrapiApiDataList>([
    {
      ...apiData,
      title: 'API Data Without API Details',
      apiRestDetail: undefined,
      apiSoapDetail: undefined,
    },
  ] as StrapiApiDataList);
}

export function apiDataWithInvalidRestApiDetails() {
  const apiData = strapiApiDataList.data[0];
  return wrapAsRootEntity<StrapiApiDataList>([
    {
      ...apiData,
      title: 'API Data Without API Details',
      apiRestDetail: {
        slug: '',
        specUrls: [],
      },
      apiSoapDetail: undefined,
    },
  ] as StrapiApiDataList);
}

export function apiDatalistWithItemMissingSlug() {
  const apiData = strapiApiDataList.data[0];
  return wrapAsRootEntity<StrapiApiDataList>([
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
  ] as StrapiApiDataList);
}

export function mixedApiDataValidAndInvalid() {
  const validRestApi = strapiApiDataList.data[0];
  const validSoapApi = strapiApiDataList.data[1];
  const invalidApi = apiDataWithoutApiDetails().data[0];
  const invalidProductApi = apiDataWithMissingProduct().data[0];

  return wrapAsRootEntity<StrapiApiDataList>([
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
  ] as StrapiApiDataList);
}

export function apiDataWithoutProductBannerLinks() {
  const apiData = strapiApiDataList.data[0];
  return wrapAsRootEntity<StrapiApiDataList>([
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
    },
  ] as StrapiApiDataList);
}

export function apiDataWithCorruptedProduct() {
  const apiData = strapiApiDataList.data[0];
  return wrapAsRootEntity<StrapiApiDataList>([
    {
      ...apiData,
      title: 'API Data With Corrupted Product',
      product: undefined as any,
    },
  ] as StrapiApiDataList);
}

export function allInvalidApiData() {
  return wrapAsRootEntity<StrapiApiDataList>([
    apiDataWithoutApiDetails().data[0],
    apiDataWithMissingProduct().data[0],
    apiDataWithCorruptedProduct().data[0],
  ] as StrapiApiDataList);
}

export function soapApiDataOnly() {
  const soapApi = strapiApiDataList.data[1];
  return wrapAsRootEntity<StrapiApiDataList>([soapApi] as StrapiApiDataList);
}

export function restApiDataOnly() {
  const restApi = strapiApiDataList.data[0];
  return wrapAsRootEntity<StrapiApiDataList>([restApi] as StrapiApiDataList);
}

export function restApiDataWithMultipleSpecs() {
  const restApi = strapiApiDataList.data[0];
  return wrapAsRootEntity<StrapiApiDataList>([
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
  ] as StrapiApiDataList);
}

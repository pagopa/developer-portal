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
        attributes: {
          ...apiData.attributes,
          title: 'Minimal API Data',
          description: undefined,
          seo: undefined,
          bannerLinks: [],
          product: {
            data: {
              ...apiData.attributes.product.data,
              attributes: {
                ...apiData.attributes.product.data.attributes,
                bannerLinks: undefined,
              },
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
        attributes: {
          ...apiData.attributes,
          bannerLinks: [],
        },
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
        attributes: {
          ...apiData.attributes,
          title: 'API Data Without Product',
          product: {
            data: undefined as any,
          },
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
        attributes: {
          ...apiData.attributes,
          title: 'API Data Without API Details',
          apiRestDetail: undefined,
          apiSoapDetail: undefined,
        },
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
        attributes: {
          ...apiData.attributes,
          title: 'API Data Without API Details',
          apiRestDetail: {
            slug: '',
            specUrls: [],
          },
          apiSoapDetail: undefined,
        },
      },
    ],
  } satisfies StrapiApiDataList;
}

export function apiDataWithSoapApiDetailsWithoutSlug() {
  const apiData = strapiApiDataList.data[0];
  return {
    ...strapiApiDataList,
    data: [
      {
        ...apiData,
        attributes: {
          ...apiData.attributes,
          title: 'API Data Without API Details',
          apiRestDetail: undefined,
          apiSoapDetail: {
            slug: undefined as any,
            repositoryUrl: 'https://example.com/soap.wsdl',
            dirName: 'soap-dir',
          },
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
        attributes: {
          ...validRestApi.attributes,
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
        attributes: {
          ...apiData.attributes,
          bannerLinks: [],
          product: {
            data: {
              ...apiData.attributes.product.data,
              attributes: {
                ...apiData.attributes.product.data.attributes,
                bannerLinks: [],
              },
            },
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
        attributes: {
          ...apiData.attributes,
          title: 'API Data With Corrupted Product',
          product: {
            data: {
              ...apiData.attributes.product.data,
              attributes: undefined as any,
            },
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
        attributes: {
          ...restApi.attributes,
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
      },
    ],
  } satisfies StrapiApiDataList;
}

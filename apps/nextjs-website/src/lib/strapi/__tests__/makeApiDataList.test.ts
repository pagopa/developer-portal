import { makeApiDataList } from '@/lib/strapi/makeProps/makeApiDataList';
import { StrapiApiDataList } from '@/lib/strapi/types/apiDataList';
import _ from 'lodash';
import {
  strapiApiDataList,
  expectedApiDataPageProps,
} from '@/lib/strapi/__tests__/fixtures/apiDataList';
import {
  minimalApiDataList,
  apiDataWithoutBannerLinks,
  apiDataWithMissingProduct,
  apiDataWithoutApiDetails,
  mixedApiDataValidAndInvalid,
  apiDataWithoutProductBannerLinks,
  allInvalidApiData,
  soapApiDataOnly,
  restApiDataOnly,
  restApiDataWithMultipleSpecs,
  apiDataWithInvalidRestApiDetails,
  apiDataWithSoapApiDetailsWithoutSlug,
} from '@/lib/strapi/__tests__/factories/apiDataList';

// Mock the makeApiSoapUrlList function
jest.mock('@/lib/strapi/makeProps/makeApiSoapUrlList', () => ({
  makeApiSoapUrlList: jest
    .fn()
    .mockResolvedValue([
      { name: 'test.wsdl', url: 'https://example.com/test.wsdl' },
    ]),
}));

describe('makeApiDataList', () => {
  it('should transform strapi api data list to api data page props', async () => {
    const result = await makeApiDataList(_.cloneDeep(strapiApiDataList));
    expect(result).toHaveLength(2);
    expect(result[0]).toMatchObject(expectedApiDataPageProps[0]);
    expect(result[1]).toMatchObject(expectedApiDataPageProps[1]);
  });

  it('should handle minimal data with missing optional fields', async () => {
    const result = await makeApiDataList(_.cloneDeep(minimalApiDataList()));
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe('Minimal API Data');
    expect(result[0].apiDataSlug).toBe('minimal-api');
    expect(result[0].apiType).toBe('rest');
    expect(result[0].seo).toBeUndefined();
    expect(result[0].bannerLinks).toBeUndefined();
  });

  it('should handle empty data array', async () => {
    const emptyData: StrapiApiDataList = {
      data: [],
    };
    const result = await makeApiDataList(emptyData);
    expect(result).toHaveLength(0);
  });

  it('should use product banner links when api data banner links are empty', async () => {
    const result = await makeApiDataList(apiDataWithoutBannerLinks());
    expect(result[0].bannerLinks).toBeDefined();
    expect(result[0].bannerLinks).toHaveLength(1);
    expect(result[0].bannerLinks?.[0].title).toBe('Banner Link 1');
  });

  it('should filter out api data without rest or soap details', async () => {
    const result = await makeApiDataList(apiDataWithoutApiDetails());
    expect(result).toHaveLength(0);
  });

  it('should filter out api data with rest api details with invalid data', async () => {
    const result = await makeApiDataList(apiDataWithInvalidRestApiDetails());
    expect(result).toHaveLength(0);
  });

  it('should filter out api data with soap api details without slug', async () => {
    const result = await makeApiDataList(
      apiDataWithSoapApiDetailsWithoutSlug()
    );
    expect(result).toHaveLength(0);
  });

  it('should handle mixed valid and invalid api data', async () => {
    const result = await makeApiDataList(mixedApiDataValidAndInvalid());

    // Should return only the 3 valid api data items, filtering out invalid ones
    expect(result).toHaveLength(3);
    expect(result[0].title).toBe('SEND Main');
    expect(result[1].title).toBe('Documentazione SOAP');
    expect(result[2].title).toBe('Another Valid REST API');
  });

  it('should handle api data without banner links and without product banner links', async () => {
    const result = await makeApiDataList(apiDataWithoutProductBannerLinks());
    expect(result[0].bannerLinks).toEqual([]);
  });

  it('should return empty array when all api data are invalid', async () => {
    const result = await makeApiDataList(allInvalidApiData());
    expect(result).toHaveLength(0);
  });

  it('should correctly identify REST API type', async () => {
    const result = await makeApiDataList(restApiDataOnly());
    expect(result[0].apiType).toBe('rest');
    expect(result[0].restApiSpecUrls).toHaveLength(1);
    expect(result[0].apiSoapUrlList).toEqual([]);
    expect(result[0].apiSoapUrl).toBeUndefined();
  });

  it('should correctly identify SOAP API type', async () => {
    const result = await makeApiDataList(soapApiDataOnly());
    expect(result[0].apiType).toBe('soap');
    expect(result[0].restApiSpecUrls).toEqual([]);
    expect(result[0].apiSoapUrlList).toHaveLength(1);
    expect(result[0].apiSoapUrl).toBe('https://github.com/pagopa/pagopa-api/');
  });

  it('should prioritize api data banner links over product banner links', async () => {
    const result = await makeApiDataList(strapiApiDataList);
    expect(result[0].bannerLinks).toHaveLength(2);
    expect(result[0].bannerLinks?.[0].title).toBe('Banner Link 1');
    expect(result[0].bannerLinks?.[1].title).toBe('Banner Link 2');
  });

  it('should handle api data with product that has undefined banner links', async () => {
    const result = await makeApiDataList(minimalApiDataList());
    expect(result[0].bannerLinks).toBeUndefined();
  });

  it('should set correct specUrlsName from title', async () => {
    const result = await makeApiDataList(strapiApiDataList);
    expect(result[0].specUrlsName).toBe('SEND Main');
    expect(result[1].specUrlsName).toBe('Documentazione SOAP');
  });

  it('should handle REST API with multiple spec URLs', async () => {
    const result = await makeApiDataList(restApiDataWithMultipleSpecs());
    expect(result[0].restApiSpecUrls).toHaveLength(2);
    expect(result[0].restApiSpecUrls[0].name).toBe('API 1');
    expect(result[0].restApiSpecUrls[1].hideTryIt).toBe(true);
  });

  it('should handle SOAP API and call makeApiSoapUrlList', async () => {
    const result = await makeApiDataList(soapApiDataOnly());
    expect(result[0].apiSoapUrlList).toEqual([
      { name: 'test.wsdl', url: 'https://example.com/test.wsdl' },
    ]);
  });

  it('should handle api data with missing product gracefully', async () => {
    const result = await makeApiDataList(apiDataWithMissingProduct());
    // Should filter out items with missing product since makeBaseProductWithoutLogo would fail
    expect(result).toHaveLength(0);
  });
});

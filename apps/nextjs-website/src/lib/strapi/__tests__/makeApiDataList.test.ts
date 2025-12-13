import { makeApiDataListProps } from '@/lib/strapi/makeProps/makeApiDataList';
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
  apiDatalistWithItemMissingSlug,
} from '@/lib/strapi/__tests__/factories/apiDataList';
import { spyOnConsoleError } from '@/lib/strapi/__tests__/spyOnConsole';

// Mock the makeApiSoapUrlList function
jest.mock('@/lib/strapi/makeProps/makeApiSoapUrlList', () => ({
  makeApiSoapUrlList: jest
    .fn()
    .mockResolvedValue([
      { name: 'test.wsdl', url: 'https://example.com/test.wsdl' },
    ]),
}));

describe('makeApiDataListProps', () => {
  beforeEach(() => {
    spyOnConsoleError.mockClear();
  });

  afterAll(() => {
    spyOnConsoleError.mockRestore();
  });

  it('should transform strapi api data list to api data page props', async () => {
    const result = await makeApiDataListProps(
      _.cloneDeep({ data: strapiApiDataList })
    );
    expect(result).toHaveLength(2);
    expect(result[0]).toMatchObject(expectedApiDataPageProps[0]);
    expect(result[1]).toMatchObject(expectedApiDataPageProps[1]);
  });

  it('should handle minimal data with missing optional fields', async () => {
    const result = await makeApiDataListProps(
      _.cloneDeep({ data: minimalApiDataList() })
    );
    expect(result).toHaveLength(1);
    const firstElement = result[0];
    expect(firstElement.title).toBe('Minimal API Data');
    expect(firstElement.apiDataSlug).toBe('minimal-api');
    expect(firstElement.apiType).toBe('rest');
    expect(firstElement.seo).toBeUndefined();
    expect(firstElement.bannerLinks).toBeUndefined();
  });

  it('should handle empty data array', async () => {
    const emptyData: StrapiApiDataList = [];
    const result = await makeApiDataListProps({ data: [...emptyData] });
    expect(result).toHaveLength(0);
  });

  it('should use product banner links when api data banner links are empty', async () => {
    const result = await makeApiDataListProps({
      data: apiDataWithoutBannerLinks(),
    });
    const firstElement = result[0];
    expect(firstElement.bannerLinks).toBeDefined();
    expect(firstElement.bannerLinks).toHaveLength(1);
    expect(firstElement.bannerLinks?.[0].title).toBe('Banner Link 1');
  });

  it('should filter out api data without rest or soap details', async () => {
    const result = await makeApiDataListProps({
      data: apiDataWithoutApiDetails(),
    });
    expect(result).toHaveLength(0);
  });

  it('should filter out api data with rest api details with invalid data', async () => {
    const result = await makeApiDataListProps({
      data: apiDataWithInvalidRestApiDetails(),
    });
    expect(result).toHaveLength(0);
    expect(spyOnConsoleError).toHaveBeenCalledWith(
      expect.stringContaining(
        'Error while processing API Data with title "API Data Without API Details": missing API slug. Skipping...'
      )
    );
  });

  it('should filter out api data with soap api details without slug', async () => {
    const result = await makeApiDataListProps({
      data: apiDatalistWithItemMissingSlug(),
    });
    expect(result).toHaveLength(0);
    expect(spyOnConsoleError).toHaveBeenCalledWith(
      expect.stringContaining(
        'Error while processing API Data with title "API Data Without API Details": missing API slug. Skipping...'
      )
    );
  });

  it('should handle mixed valid and invalid api data', async () => {
    const result = await makeApiDataListProps({
      data: mixedApiDataValidAndInvalid(),
    });

    // Should return only the 3 valid api data items, filtering out invalid ones
    expect(result).toHaveLength(3);
    expect(result[0].title).toBe('SEND Main');
    expect(result[1].title).toBe('Documentazione SOAP');
    expect(result[2].title).toBe('Another Valid REST API');
    expect(spyOnConsoleError).toHaveBeenCalledTimes(1);
  });

  it('should handle api data without banner links and without product banner links', async () => {
    const result = await makeApiDataListProps({
      data: apiDataWithoutProductBannerLinks(),
    });
    expect(result[0].bannerLinks).toEqual([]);
  });

  it('should return empty array when all api data are invalid', async () => {
    const result = await makeApiDataListProps({
      data: [...allInvalidApiData()],
    });
    expect(result).toHaveLength(0);
    expect(spyOnConsoleError).toHaveBeenCalled();
  });

  it('should correctly identify REST API type', async () => {
    const result = await makeApiDataListProps({ data: restApiDataOnly() });
    const firstElement = result[0];
    expect(firstElement.apiType).toBe('rest');
    expect(firstElement.restApiSpecUrls).toHaveLength(1);
    expect(firstElement.apiSoapUrlList).toEqual([]);
    expect(firstElement.apiSoapUrl).toBeUndefined();
  });

  it('should correctly identify SOAP API type', async () => {
    const result = await makeApiDataListProps({ data: soapApiDataOnly() });
    const firstElement = result[0];
    expect(firstElement.apiType).toBe('soap');
    expect(firstElement.restApiSpecUrls).toEqual([]);
    expect(firstElement.apiSoapUrlList).toHaveLength(1);
    expect(firstElement.apiSoapUrl).toBe(
      'https://github.com/pagopa/pagopa-api/'
    );
  });

  it('should prioritize api data banner links over product banner links', async () => {
    const result = await makeApiDataListProps({ data: strapiApiDataList });
    const firstElement = result[0];
    expect(firstElement.bannerLinks).toHaveLength(2);
    expect(firstElement.bannerLinks?.[0].title).toBe('Banner Link 1');
    expect(firstElement.bannerLinks?.[1].title).toBe('Banner Link 2');
  });

  it('should handle api data with product that has undefined banner links', async () => {
    const result = await makeApiDataListProps({ data: minimalApiDataList() });
    expect(result[0].bannerLinks).toBeUndefined();
  });

  it('should set correct specUrlsName from title', async () => {
    const result = await makeApiDataListProps({ data: strapiApiDataList });
    expect(result[0].specUrlsName).toBe('SEND Main');
    expect(result[1].specUrlsName).toBe('Documentazione SOAP');
  });

  it('should handle REST API with multiple spec URLs', async () => {
    const result = await makeApiDataListProps({
      data: restApiDataWithMultipleSpecs(),
    });
    const firstElement = result[0];
    expect(firstElement.restApiSpecUrls).toHaveLength(2);
    expect(firstElement.restApiSpecUrls[0].name).toBe('API 1');
    expect(firstElement.restApiSpecUrls[1].hideTryIt).toBe(true);
  });

  it('should handle SOAP API and call makeApiSoapUrlList', async () => {
    const result = await makeApiDataListProps({ data: soapApiDataOnly() });
    expect(result[0].apiSoapUrlList).toEqual([
      { name: 'test.wsdl', url: 'https://example.com/test.wsdl' },
    ]);
  });

  it('should handle api data with missing product gracefully', async () => {
    const result = await makeApiDataListProps({
      data: apiDataWithMissingProduct(),
    });
    // Should filter out items with missing product since makeBaseProductWithoutLogoProps would fail
    expect(result).toHaveLength(0);
    expect(spyOnConsoleError).toHaveBeenCalledWith(
      'Error while processing API Data with title "API Data Without Product": missing product data. Skipping...'
    );
  });
});

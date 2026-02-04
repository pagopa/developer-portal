import { makeApiDataListPagesProps } from '@/lib/strapi/makeProps/makeApiDataListPages';
import _ from 'lodash';
import {
  strapiApiDataListPages,
  expectedApiDataListPageProps,
} from '@/lib/strapi/__tests__/fixtures/apiDataListPages';
import {
  minimalApiDataListPages,
  apiDataListPageWithEmptyApiData,
  apiDataListPageWithMixedApiTypes,
  apiDataListPageWithoutDescription,
  apiDataListPageWithInvalidApiData,
  multipleApiDataListPages,
  emptyApiDataListPages,
  apiDataListPageWithBothRestAndSoap,
} from '@/lib/strapi/__tests__/factories/apiDataListPages';
import { spyOnConsoleError } from '@/lib/strapi/__tests__/spyOnConsole';

describe('makeApiDataListPagesProps', () => {
  beforeEach(() => {
    spyOnConsoleError.mockClear();
  });

  afterAll(() => {
    spyOnConsoleError.mockRestore();
  });

  it('should transform strapi api data list pages to api data list page template props', () => {
    const result = makeApiDataListPagesProps(
      'it',
      _.cloneDeep(strapiApiDataListPages)
    );
    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject(expectedApiDataListPageProps[0]);
  });

  it('should handle minimal data with missing optional fields', () => {
    const result = makeApiDataListPagesProps(
      'it',
      _.cloneDeep(minimalApiDataListPages())
    );
    expect(result).toHaveLength(1);
    const firstElement = result[0];
    expect(firstElement.hero.title).toBe('Minimal API List Page');
    expect(firstElement.hero.subtitle).toBe('');
    expect(firstElement.seo).toBeUndefined();
    expect(firstElement.cards).toHaveLength(1);
    expect(firstElement.cards[0].title).toBe('Minimal API');
    expect(firstElement.cards[0].icon).toBe(undefined);
    expect(firstElement.apiData).toBeDefined();
  });

  it('should handle empty data array', () => {
    const result = makeApiDataListPagesProps('it', emptyApiDataListPages());
    expect(result).toHaveLength(0);
  });

  it('should handle page with empty api data', () => {
    const result = makeApiDataListPagesProps(
      'it',
      apiDataListPageWithEmptyApiData()
    );
    expect(result).toHaveLength(1);
    expect(result[0].cards).toHaveLength(0);
    expect(result[0].apiDetailSlugs).toHaveLength(0);
  });

  it('should handle mixed API types and filter invalid ones', () => {
    const result = makeApiDataListPagesProps(
      'it',
      apiDataListPageWithMixedApiTypes()
    );
    expect(result).toHaveLength(1);
    const firstElement = result[0];
    expect(firstElement.cards).toHaveLength(2);
    expect(firstElement.cards[0].labels?.[0].label).toBe('REST');
    expect(firstElement.cards[1].labels?.[0].label).toBe('SOAP');
    expect(firstElement.apiDetailSlugs).toEqual(['rest-api', 'soap-api']);
  });

  it('should handle page without description', () => {
    const result = makeApiDataListPagesProps(
      'it',
      apiDataListPageWithoutDescription()
    );
    expect(result).toHaveLength(1);
    expect(result[0].hero.subtitle).toBe('');
  });

  it('should filter out invalid API data', () => {
    const result = makeApiDataListPagesProps(
      'it',
      apiDataListPageWithInvalidApiData()
    );
    expect(result).toHaveLength(1);
    const firstElement = result[0];
    expect(firstElement.cards).toHaveLength(0);
    expect(firstElement.apiDetailSlugs).toHaveLength(0);
    expect(spyOnConsoleError).toHaveBeenCalledWith(
      expect.stringContaining(
        'Error while processing API Data with title "undefined": missing API slug. Skipping...'
      )
    );
  });

  it('should handle multiple pages', () => {
    const result = makeApiDataListPagesProps('it', multipleApiDataListPages());
    expect(result).toHaveLength(2);
    expect(result[0].hero.title).toBe('SEND API Documentation');
    expect(result[1].hero.title).toBe('Second API List Page');
  });

  it('should correctly set hero properties', () => {
    const result = makeApiDataListPagesProps('it', strapiApiDataListPages);
    expect(result[0].hero).toEqual({
      title: 'SEND API Documentation',
      subtitle: 'Complete documentation for SEND APIs',
    });
  });

  it('should correctly identify REST API type', () => {
    const result = makeApiDataListPagesProps('it', strapiApiDataListPages);
    const restCard = result[0].cards.find(
      (card) => card.labels?.[0].label === 'REST'
    );
    expect(restCard).toBeDefined();
    expect(restCard?.title).toBe('SEND Main API');
    expect(restCard?.href).toBe('/send/api/send-main');
  });

  it('should correctly identify SOAP API type', () => {
    const result = makeApiDataListPagesProps('it', strapiApiDataListPages);
    const soapCard = result[0].cards.find(
      (card) => card.labels?.[0].label === 'SOAP'
    );
    expect(soapCard).toBeDefined();
    expect(soapCard?.title).toBe('SEND SOAP API');
    expect(soapCard?.href).toBe('/send/api/send-soap');
  });

  it('should correctly map banner links', () => {
    const result = makeApiDataListPagesProps('it', strapiApiDataListPages);
    const firstElement = result[0];
    expect(firstElement.bannerLinks).toHaveLength(2);
    expect(firstElement.bannerLinks[0]).toHaveProperty('title');
    expect(firstElement.bannerLinks[0]).toHaveProperty('icon');
  });

  it('should correctly map SEO properties', () => {
    const result = makeApiDataListPagesProps('it', strapiApiDataListPages);
    expect(result[0].seo).toEqual({
      metaTitle: 'SEND API Documentation',
      metaDescription: 'Complete documentation for SEND APIs',
    });
  });

  it('should correctly map updatedAt', () => {
    const result = makeApiDataListPagesProps('it', strapiApiDataListPages);
    expect(result[0].updatedAt).toBe('2024-01-02T00:00:00.000Z');
  });

  it('should filter cards without title or tags', () => {
    const result = makeApiDataListPagesProps(
      'it',
      apiDataListPageWithInvalidApiData()
    );
    expect(result[0].cards).toHaveLength(0);
    expect(spyOnConsoleError).toHaveBeenCalledWith(
      expect.stringContaining(
        'Error while processing API Data with title "undefined": missing API slug. Skipping...'
      )
    );
  });

  it('should handle API data with missing icon', () => {
    const result = makeApiDataListPagesProps('it', minimalApiDataListPages());
    expect(result[0].cards[0].icon).toBe(undefined);
  });

  it('should correctly generate href for cards', () => {
    const result = makeApiDataListPagesProps('it', strapiApiDataListPages);
    const firstElement = result[0];
    expect(firstElement.cards).toHaveLength(2);
    expect(firstElement.cards[0].href).toBe('/send/api/send-main');
    expect(firstElement.cards[1].href).toBe('/send/api/send-soap');
  });

  it('should prioritize REST slug over SOAP slug in apiDetailSlugs', () => {
    const result = makeApiDataListPagesProps(
      'it',
      apiDataListPageWithBothRestAndSoap()
    );
    expect(result[0].apiDetailSlugs).toEqual(['rest-slug']);
  });
});

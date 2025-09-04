import {
  makeProductsProps,
  makeProductProps,
  makeBaseProductWithoutLogoProps,
} from '@/lib/strapi/makeProps/makeProducts';
import { StrapiProducts } from '@/lib/strapi/types/product';
import _ from 'lodash';
import {
  strapiProducts,
  expectedProduct,
} from '@/lib/strapi/__tests__/fixtures/products';
import {
  minimalProduct,
  productWithoutSlug,
  productWithMultipleApiData,
  productWithEmptyApiData,
  productWithCorruptedData,
  mixedValidAndInvalidProducts,
  allInvalidProducts,
  productWithMissingAttributes,
  productWithEmptySlug,
} from '@/lib/strapi/__tests__/factories/products';
import { consoleSpy } from '@/lib/strapi/__tests__/consoleMock';

describe('makeProductsProps', () => {
  afterEach(() => {
    consoleSpy.mockClear();
  });

  it('should transform strapi products to product props', () => {
    const result = makeProductsProps(_.cloneDeep(strapiProducts));
    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject(expectedProduct);
  });

  it('should handle minimal product data', () => {
    const result = makeProductsProps(_.cloneDeep(minimalProduct()));
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Minimal Product');
    expect(result[0].slug).toBe('minimal-product');
    expect(result[0].shortName).toBe('MP');
    expect(result[0].description).toBeUndefined();
    expect(result[0].bannerLinks).toEqual([]);
    expect(result[0].hasApiDataListPage).toBe(false);
    expect(result[0].hasTutorialListPage).toBe(false);
    expect(result[0].hasGuideListPage).toBe(false);
    expect(result[0].hasOverviewPage).toBe(false);
    expect(result[0].hasQuickstartGuidePage).toBe(false);
    expect(result[0].hasReleaseNotePage).toBe(false);
  });

  it('should handle empty data array', () => {
    const emptyData: StrapiProducts = {
      data: [],
    };
    const result = makeProductsProps(emptyData);
    expect(result).toHaveLength(0);
  });

  it('should skip products without slug and log error', () => {
    const result = makeProductsProps(productWithoutSlug());

    expect(result).toHaveLength(0);
    expect(consoleSpy).toHaveBeenCalledWith(
      'Product with id Product Without Slug is missing a slug'
    );
  });

  it('should handle products with multiple API data (returns general API URL)', () => {
    const result = makeProductsProps(productWithMultipleApiData());
    expect(result[0].hasApiDataListPage).toBe(true);
    expect(result[0].apiDataListPageUrl).toBe('/test-product/api');
  });

  it('should handle products with empty API data', () => {
    const result = makeProductsProps(productWithEmptyApiData());
    expect(result[0].hasApiDataListPage).toBe(false);
    expect(result[0].apiDataListPageUrl).toBeUndefined();
  });

  it('should handle corrupted data with try/catch and log error', () => {
    const result = makeProductsProps(productWithCorruptedData());

    expect(result).toHaveLength(0);
    expect(consoleSpy).toHaveBeenCalledWith(
      'Error while mapping product with id Corrupted Product:',
      expect.any(Error)
    );
  });

  it('should handle mixed valid and invalid products', () => {
    const result = makeProductsProps(mixedValidAndInvalidProducts());

    expect(result).toHaveLength(2);
    expect(result[0].name).toBe('Test Product');
    expect(result[1].name).toBe('Another Valid Product');
    expect(consoleSpy).toHaveBeenCalledWith(
      'Product with id Product Without Slug is missing a slug'
    );
  });

  it('should return empty array when all products are invalid', () => {
    const result = makeProductsProps(allInvalidProducts());

    expect(result).toHaveLength(0);
    expect(consoleSpy).toHaveBeenCalledTimes(2);
  });
});

describe('makeProductProps', () => {
  afterEach(() => {
    consoleSpy.mockClear();
  });

  afterAll(() => {
    consoleSpy.mockRestore();
  });

  it('should transform single strapi product to product props', () => {
    const result = makeProductProps(strapiProducts.data[0]);
    expect(result).toMatchObject(expectedProduct);
  });

  it('should return null for product without slug', () => {
    const result = makeProductProps(productWithoutSlug().data[0]);
    expect(result).toBeNull();
    expect(consoleSpy).toHaveBeenCalledWith(
      'Product with id Product Without Slug is missing a slug'
    );
  });

  it('should return null and log error for corrupted product', () => {
    const result = makeProductProps(productWithCorruptedData().data[0]);
    expect(result).toBeNull();
    expect(consoleSpy).toHaveBeenCalledTimes(1);
  });

  it('should return null and log error for product with missing attributes', () => {
    const result = makeProductProps(productWithMissingAttributes());
    expect(result).toBeNull();
    expect(consoleSpy).toHaveBeenCalledWith(
      'Invalid product data:',
      productWithMissingAttributes()
    );
  });
});

describe('makeBaseProductWithoutLogoProps', () => {
  it('should create base product props without logo', () => {
    const result = makeBaseProductWithoutLogoProps(strapiProducts.data[0]);

    expect(result).toEqual({
      slug: 'test-product',
      name: 'Test Product',
      shortName: 'TP',
      hasApiDataListPage: true,
      apiDataListPageUrl: '/test-product/api/api-detail',
      hasTutorialListPage: true,
      hasGuideListPage: true,
      hasOverviewPage: true,
      hasQuickstartGuidePage: true,
      hasReleaseNotePage: true,
      bannerLinks: expectedProduct.bannerLinks,
    });
  });

  it('should handle product with no banner links', () => {
    const result = makeBaseProductWithoutLogoProps(minimalProduct().data[0]);
    expect(result.bannerLinks).toEqual([]);
  });

  it('should correctly determine API data list page URL for single API', () => {
    const result = makeBaseProductWithoutLogoProps(strapiProducts.data[0]);
    expect(result.apiDataListPageUrl).toBe('/test-product/api/api-detail');
  });

  it('should correctly determine API data list page URL for multiple APIs', () => {
    const result = makeBaseProductWithoutLogoProps(
      productWithMultipleApiData().data[0]
    );
    expect(result.apiDataListPageUrl).toBe('/test-product/api');
  });

  it('should handle undefined API data list page', () => {
    const result = makeBaseProductWithoutLogoProps(minimalProduct().data[0]);
    expect(result.hasApiDataListPage).toBe(false);
    expect(result.apiDataListPageUrl).toBeUndefined();
  });

  it('should throw error for product without slug', () => {
    expect(() =>
      makeBaseProductWithoutLogo(productWithoutSlug().data[0])
    ).toThrow(Error('Product with id Product Without Slug is missing a slug'));
  });

  it('should throw error for product with empty slug', () => {
    expect(() =>
      makeBaseProductWithoutLogo(productWithEmptySlug().data[0])
    ).toThrow(Error('Product with id Product Without Slug is missing a slug'));
  });
});

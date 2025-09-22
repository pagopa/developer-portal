import {
  makeProductsProps,
  makeProduct,
  makeBaseProductWithoutLogo,
} from '@/lib/strapi/makeProps/makeProducts';
import { StrapiProducts } from '@/lib/strapi/types/product';
import _ from 'lodash';
import {
  strapiProducts,
  expectedProduct,
} from '@/lib/strapi/__tests__/fixtures/products';
import {
  minimalProduct,
  productWithMultipleApiData,
  productWithEmptyApiData,
  productWithCorruptedData,
  mixedValidAndInvalidProducts,
  allInvalidProducts,
  productWithMissingAttributes,
  productsWithAnItemWithEmptySlug,
  productsWithAnItemMissingSlug,
} from '@/lib/strapi/__tests__/factories/products';
import { spyOnConsoleError } from '@/lib/strapi/__tests__/spyOnConsole';

describe('makeProductsProps', () => {
  afterEach(() => {
    spyOnConsoleError.mockClear();
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
      meta: { pagination: { page: 1, pageSize: 25, pageCount: 1, total: 0 } },
    };
    const result = makeProductsProps(emptyData);
    expect(result).toHaveLength(0);
  });

  it('should skip products without slug and log error', () => {
    const result = makeProductsProps(productsWithAnItemMissingSlug());

    expect(result).toHaveLength(0);
    expect(spyOnConsoleError).toHaveBeenCalledWith(
      'Error while processing Product: missing title or slug. Title: Product Without Slug | Slug: undefined. Skipping...'
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
    expect(spyOnConsoleError).toHaveBeenCalledWith(
      'Error while processing Product with name "Corrupted Product":',
      expect.any(Error),
      'Skipping...'
    );
  });

  it('should handle mixed valid and invalid products', () => {
    const result = makeProductsProps(mixedValidAndInvalidProducts());

    expect(result).toHaveLength(2);
    expect(result[0].name).toBe('Test Product');
    expect(result[1].name).toBe('Another Valid Product');
    expect(spyOnConsoleError).toHaveBeenCalledWith(
      'Error while processing Product: missing title or slug. Title: Product Without Slug | Slug: undefined. Skipping...'
    );
  });

  it('should return empty array when all products are invalid', () => {
    const result = makeProductsProps(allInvalidProducts());

    expect(result).toHaveLength(0);
    expect(spyOnConsoleError).toHaveBeenCalledTimes(2);
  });
});

describe('makeProductProps', () => {
  afterEach(() => {
    spyOnConsoleError.mockClear();
  });

  afterAll(() => {
    spyOnConsoleError.mockRestore();
  });

  it('should transform single strapi product to product props', () => {
    const result = makeProduct(strapiProducts.data[0]);
    expect(result).toMatchObject(expectedProduct);
  });

  it('should return null for product without slug', () => {
    const result = makeProduct(productsWithAnItemMissingSlug().data[0]);
    expect(result).toBeNull();
    expect(spyOnConsoleError).toHaveBeenCalledWith(
      'Error while processing Product: missing title or slug. Title: Product Without Slug | Slug: undefined. Skipping...'
    );
  });

  it('should return null and log error for corrupted product', () => {
    const result = makeProduct(productWithCorruptedData().data[0]);
    expect(result).toBeNull();
    expect(spyOnConsoleError).toHaveBeenCalledTimes(1);
  });

  it('should return null and log error for product with missing attributes', () => {
    const result = makeProduct(productWithMissingAttributes());
    expect(result).toBeNull();
    expect(spyOnConsoleError).toHaveBeenCalledWith(
      'Invalid product data:',
      productWithMissingAttributes()
    );
  });
});

describe('makeBaseProductWithoutLogoProps', () => {
  it('should create base product props without logo', () => {
    const result = makeBaseProductWithoutLogo(strapiProducts.data[0]);

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
    const result = makeBaseProductWithoutLogo(minimalProduct().data[0]);
    expect(result.bannerLinks).toEqual([]);
  });

  it('should correctly determine API data list page URL for single API', () => {
    const result = makeBaseProductWithoutLogo(strapiProducts.data[0]);
    expect(result.apiDataListPageUrl).toBe('/test-product/api/api-detail');
  });

  it('should correctly determine API data list page URL for multiple APIs', () => {
    const result = makeBaseProductWithoutLogo(
      productWithMultipleApiData().data[0]
    );
    expect(result.apiDataListPageUrl).toBe('/test-product/api');
  });

  it('should handle undefined API data list page', () => {
    const result = makeBaseProductWithoutLogo(minimalProduct().data[0]);
    expect(result.hasApiDataListPage).toBe(false);
    expect(result.apiDataListPageUrl).toBeUndefined();
  });

  it('should throw error for product without slug', () => {
    expect(() =>
      makeBaseProductWithoutLogo(productsWithAnItemMissingSlug().data[0])
    ).toThrow(
      Error(
        'Error while processing Product with name "Product Without Slug": missing slug. Skipping...'
      )
    );
  });

  it('should throw error for product with empty slug', () => {
    expect(() =>
      makeBaseProductWithoutLogo(productsWithAnItemWithEmptySlug().data[0])
    ).toThrow(
      Error(
        'Error while processing Product with name "Product Without Slug": missing slug. Skipping...'
      )
    );
  });
});

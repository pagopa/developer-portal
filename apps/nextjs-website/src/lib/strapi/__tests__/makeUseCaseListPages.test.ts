import _ from 'lodash';
import { makeUseCaseListPagesProps } from '@/lib/strapi/makeProps/makeUseCaseListPages';
import { strapiUseCaseListPages } from './fixtures/useCaseListPage';
import {
  emptyUseCaseListPages,
  minimalUseCaseListPages,
  useCaseListPagesWithItemMissingBannerLinks,
} from './factories/useCaseListPage';

describe('makeUseCaseListPagesProps', () => {
  it('should transform strapi use case list pages to use cases page props', () => {
    const result = makeUseCaseListPagesProps(
      'it',
      _.cloneDeep(strapiUseCaseListPages)
    );
    expect(result).toHaveLength(1);
    const page = result[0];
    expect(page.abstract?.title).toBe('Use Cases');
    expect(page.abstract?.description).toBe('Explore our use cases');
    expect(page.seo).toMatchObject({
      metaTitle: 'Use Cases SEO Title',
      metaDescription: 'Use Cases SEO Description',
    });
    expect(page.useCases).toHaveLength(1);
    const firstElement = page.useCases[0];
    expect(firstElement.title).toBe('Use Case 1');
    expect(firstElement.path).toBe('/it/product-1/use-cases/use-case-1');
    expect(firstElement.coverImage?.url).toBe(
      'https://example.com/example.jpg'
    );
  });

  it('should handle minimal use case list pages', () => {
    const result = makeUseCaseListPagesProps('it', minimalUseCaseListPages());
    expect(result).toHaveLength(1);
    const page = result[0];
    expect(page.abstract?.title).toBe('Minimal Use Cases');
    expect(page.useCases).toEqual([]);
    expect(page.seo).toBeUndefined();
    expect(page.bannerLinks).toEqual([]);
  });

  it('should handle use case list pages without banner links', () => {
    const result = makeUseCaseListPagesProps(
      'it',
      useCaseListPagesWithItemMissingBannerLinks()
    );
    expect(result).toHaveLength(1);
    expect(result[0].bannerLinks).toEqual([]);
  });

  it('should handle use case list pages with banner links', () => {
    const result = makeUseCaseListPagesProps(
      'it',
      _.cloneDeep(strapiUseCaseListPages)
    );
    expect(result).toHaveLength(1);
    const firstElement = result[0];
    expect(firstElement.bannerLinks).toBeDefined();
    expect(firstElement.bannerLinks?.length).toBeGreaterThan(0);
    expect(firstElement.bannerLinks?.[0]).toHaveProperty('title');
    expect(firstElement.bannerLinks?.[0]).toHaveProperty('icon');
  });

  it('should handle empty use case list pages', () => {
    const result = makeUseCaseListPagesProps('it', emptyUseCaseListPages());
    expect(result).toHaveLength(0);
  });
});

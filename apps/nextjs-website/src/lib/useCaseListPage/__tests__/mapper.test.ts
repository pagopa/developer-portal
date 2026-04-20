import { mapUseCaseListPageProps } from '@/lib/useCaseListPage/mapper';
import {
  emptyUseCaseListPages,
  minimalUseCaseListPages,
  useCaseListPagesWithItemMissingBannerLinks,
} from '@/lib/useCaseListPage/__tests__/factories';
import { strapiUseCaseListPages } from '@/lib/useCaseListPage/__tests__/fixtures';
import _ from 'lodash';

describe('mapUseCaseListPageProps', () => {
  it('should transform strapi use case list pages to use cases page props', () => {
    const result = mapUseCaseListPageProps(
      'it',
      _.cloneDeep(strapiUseCaseListPages)
    );

    expect(result).toHaveLength(1);
    expect(result[0].abstract?.title).toBe('Use Cases');
    expect(result[0].abstract?.description).toBe('Explore our use cases');
    expect(result[0].seo).toMatchObject({
      metaTitle: 'Use Cases SEO Title',
      metaDescription: 'Use Cases SEO Description',
    });
    expect(result[0].useCases).toHaveLength(1);
    expect(result[0].useCases[0].title).toBe('Use Case 1');
    expect(result[0].useCases[0].path).toBe(
      '/it/product-1/use-cases/use-case-1'
    );
    expect(result[0].useCases[0].coverImage?.url).toBe(
      'https://example.com/example.jpg'
    );
  });

  it('should handle minimal use case list pages', () => {
    const result = mapUseCaseListPageProps('it', minimalUseCaseListPages());

    expect(result).toHaveLength(1);
    expect(result[0].abstract?.title).toBe('Minimal Use Cases');
    expect(result[0].useCases).toEqual([]);
    expect(result[0].seo).toBeUndefined();
    expect(result[0].bannerLinks).toEqual([]);
  });

  it('should handle use case list pages without banner links', () => {
    const result = mapUseCaseListPageProps(
      'it',
      useCaseListPagesWithItemMissingBannerLinks()
    );

    expect(result).toHaveLength(1);
    expect(result[0].bannerLinks).toEqual([]);
  });

  it('should handle use case list pages with banner links', () => {
    const result = mapUseCaseListPageProps(
      'it',
      _.cloneDeep(strapiUseCaseListPages)
    );

    expect(result).toHaveLength(1);
    expect(result[0].bannerLinks).toBeDefined();
    expect(result[0].bannerLinks?.length).toBeGreaterThan(0);
    expect(result[0].bannerLinks?.[0]).toHaveProperty('title');
    expect(result[0].bannerLinks?.[0]).toHaveProperty('icon');
  });

  it('should handle empty use case list pages', () => {
    const result = mapUseCaseListPageProps('it', emptyUseCaseListPages());

    expect(result).toHaveLength(0);
  });
});

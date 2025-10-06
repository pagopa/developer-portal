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
      _.cloneDeep(strapiUseCaseListPages)
    );
    expect(result).toHaveLength(1);
    const page = result[0];
    expect(page.abstract?.title).toBe('Tutorials');
    expect(page.abstract?.description).toBe('Explore our tutorials');
    expect(page.seo).toMatchObject({
      metaTitle: 'Tutorials SEO Title',
      metaDescription: 'Tutorials SEO Description',
    });
    expect(page.useCases).toHaveLength(1);
    const firstElement = page.useCases[0];
    expect(firstElement.title).toBe('Tutorial 1');
    expect(firstElement.path).toBe('/product-1/tutorials/tutorial-1');
    expect(firstElement.image?.url).toBe('https://example.com/example.jpg');
  });

  it('should handle minimal use case list pages', () => {
    const result = makeUseCaseListPagesProps(minimalUseCaseListPages());
    expect(result).toHaveLength(1);
    const page = result[0];
    expect(page.abstract?.title).toBe('Minimal Tutorials');
    expect(page.useCases).toEqual([]);
    expect(page.seo).toBeUndefined();
    expect(page.bannerLinks).toEqual([]);
  });

  it('should handle use case list pages without banner links', () => {
    const result = makeUseCaseListPagesProps(
      useCaseListPagesWithItemMissingBannerLinks()
    );
    expect(result).toHaveLength(1);
    expect(result[0].bannerLinks).toEqual([]);
  });

  it('should handle use case list pages with banner links', () => {
    const result = makeUseCaseListPagesProps(
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
    const result = makeUseCaseListPagesProps(emptyUseCaseListPages());
    expect(result).toHaveLength(0);
  });
});

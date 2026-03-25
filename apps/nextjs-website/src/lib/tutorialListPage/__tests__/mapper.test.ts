import { mapTutorialListPageProps } from '@/lib/tutorialListPage/mapper';
import {
  emptyTutorialListPages,
  minimalTutorialListPages,
  tutorialListPagesWithItemMissingBannerLinks,
} from '@/lib/__tests__/factories/tutorialListPage';
import { strapiTutorialListPages } from '@/lib/__tests__/fixtures/tutorialListPage';
import _ from 'lodash';

describe('mapTutorialListPageProps', () => {
  it('should transform strapi tutorial list pages to tutorials page props', () => {
    const result = mapTutorialListPageProps(
      'it',
      _.cloneDeep(strapiTutorialListPages)
    );

    expect(result).toHaveLength(1);
    const page = result[0];
    expect(page.abstract?.title).toBe('Tutorials');
    expect(page.abstract?.description).toBe('Explore our tutorials');
    expect(page.seo).toMatchObject({
      metaTitle: 'Tutorials SEO Title',
      metaDescription: 'Tutorials SEO Description',
    });
    expect(page.tutorials).toHaveLength(1);
    expect(page.tutorials[0].title).toBe('Tutorial 1');
    expect(page.tutorials[0].path).toBe('/it/product-1/tutorials/tutorial-1');
    expect(page.tutorials[0].image?.url).toBe(
      'https://example.com/example.jpg'
    );
  });

  it('should handle minimal tutorial list pages', () => {
    const result = mapTutorialListPageProps('it', minimalTutorialListPages());
    const page = result[0];

    expect(result).toHaveLength(1);
    expect(page.abstract?.title).toBe('Minimal Tutorials');
    expect(page.tutorials).toEqual([]);
    expect(page.seo).toBeUndefined();
    expect(page.bannerLinks).toEqual([]);
  });

  it('should handle tutorial list pages without banner links', () => {
    const result = mapTutorialListPageProps(
      'it',
      tutorialListPagesWithItemMissingBannerLinks()
    );

    expect(result).toHaveLength(1);
    expect(result[0].bannerLinks).toEqual([]);
  });

  it('should handle tutorial list pages with banner links', () => {
    const result = mapTutorialListPageProps(
      'it',
      _.cloneDeep(strapiTutorialListPages)
    );

    expect(result).toHaveLength(1);
    expect(result[0].bannerLinks).toBeDefined();
    expect(result[0].bannerLinks?.length).toBeGreaterThan(0);
    expect(result[0].bannerLinks?.[0]).toHaveProperty('title');
    expect(result[0].bannerLinks?.[0]).toHaveProperty('icon');
  });

  it('should handle empty tutorial list pages', () => {
    const result = mapTutorialListPageProps('it', emptyTutorialListPages());

    expect(result).toHaveLength(0);
  });
});

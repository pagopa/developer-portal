import { makeTutorialListPages } from '@/lib/strapi/makeProps/makeTutorialListPages';
import _ from 'lodash';
import { strapiTutorialListPages } from './fixtures/tutorialListPage';
import {
  minimalTutorialListPages,
  tutorialListPagesWithoutBannerLinks,
  emptyTutorialListPages,
} from './factories/tutorialListPage';

describe('makeTutorialListPages', () => {
  it('should transform strapi tutorial list pages to tutorials page props', () => {
    const result = makeTutorialListPages(_.cloneDeep(strapiTutorialListPages));
    expect(result).toHaveLength(1);
    const page = result[0];
    expect(page.abstract?.title).toBe('Tutorials');
    expect(page.abstract?.description).toBe('Explore our tutorials');
    expect(page.seo).toMatchObject({
      metaTitle: 'Tutorials SEO Title',
      metaDescription: 'Tutorials SEO Description',
    });
    expect(page.tutorials).toHaveLength(1);
    const firstElement = page.tutorials[0];
    expect(firstElement.title).toBe('Tutorial 1');
    expect(firstElement.path).toBe('/product-1/tutorials/tutorial-1');
    expect(firstElement.image?.url).toBe('https://example.com/example.jpg');
  });

  it('should handle minimal tutorial list pages', () => {
    const result = makeTutorialListPages(minimalTutorialListPages());
    expect(result).toHaveLength(1);
    const page = result[0];
    expect(page.abstract?.title).toBe('Minimal Tutorials');
    expect(page.tutorials).toEqual([]);
    expect(page.seo).toBeUndefined();
    expect(page.bannerLinks).toEqual([]);
  });

  it('should handle tutorial list pages without banner links', () => {
    const result = makeTutorialListPages(tutorialListPagesWithoutBannerLinks());
    expect(result).toHaveLength(1);
    expect(result[0].bannerLinks).toEqual([]);
  });

  it('should handle tutorial list pages with banner links', () => {
    const result = makeTutorialListPages(_.cloneDeep(strapiTutorialListPages));
    expect(result).toHaveLength(1);
    const firstElement = result[0];
    expect(firstElement.bannerLinks).toBeDefined();
    expect(firstElement.bannerLinks?.length).toBeGreaterThan(0);
    expect(firstElement.bannerLinks?.[0]).toHaveProperty('title');
    expect(firstElement.bannerLinks?.[0]).toHaveProperty('icon');
  });

  it('should handle empty tutorial list pages', () => {
    const result = makeTutorialListPages(emptyTutorialListPages());
    expect(result).toHaveLength(0);
  });
});

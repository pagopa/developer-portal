import { makeTutorialsProps } from '@/lib/strapi/makeProps/makeTutorials';
import { StrapiTutorials } from '@/lib/strapi/types/tutorial';
import {
  minimalDataTutorials,
  tutorialsWithAnItemMissingSlug,
  tutorialsWithAnItemMissingProductSlug,
} from '@/lib/strapi/__tests__/factories/tutorials';
import { spyOnConsoleError } from '@/lib/strapi/__tests__/spyOnConsole';
import _ from 'lodash';
import { strapiTutorials } from './fixtures/tutorials';

describe('makeTutorialsProps', () => {
  afterEach(() => {
    spyOnConsoleError.mockClear();
  });

  afterAll(() => {
    spyOnConsoleError.mockRestore();
  });

  it('should transform strapi tutorials to tutorials props', () => {
    const result = makeTutorialsProps('it', _.cloneDeep(strapiTutorials), {});
    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      image: {
        url: 'https://example.com/example.jpg',
        alternativeText: 'Example Image',
      },
      title: 'Tutorial Title',
      name: 'Tutorial Title',
      path: '/it/pago-pa/tutorials/tutorial-title',
      productSlug: 'pago-pa',
      parts: [
        {
          code: 'console.log("Hello World");',
          language: 'javascript',
          showLineNumbers: true,
          __component: 'parts.code-block',
        },
      ],
      relatedLinks: {
        title: 'Related Links',
        links: [
          {
            text: 'Link 1',
            href: '/link-1',
          },
        ],
      },
      bannerLinks: [
        {
          title: 'Banner Link 1',
          icon: {
            alternativeText: 'Example Image',
            url: 'https://example.com/example.jpg',
          },
          theme: 'light',
        },
      ],
      seo: {
        metaTitle: 'SEO Title',
        metaDescription: 'SEO Description',
      },
      updatedAt: '2024-01-02T00:00:00.000Z',
    });
  });

  it('should handle minimal data with missing optional fields', () => {
    const result = makeTutorialsProps('it', minimalDataTutorials(), {});
    expect(result).toHaveLength(1);
    const firstElement = result[0];
    expect(firstElement.title).toBe('Minimal Data Tutorial');
    expect(firstElement.productSlug).toBe('pago-pa');
    expect(firstElement.path).toBe(
      '/it/pago-pa/tutorials/minimal-data-tutorial'
    );
    expect(firstElement.image).toBeUndefined();
    expect(firstElement.parts).toEqual([]);
    expect(firstElement.relatedLinks).toBeUndefined();
    expect(firstElement.seo).toBeUndefined();
  });

  it('should handle empty data array', () => {
    const emptyData: StrapiTutorials = {
      data: [],
      meta: {
        pagination: {
          page: 1,
          pageSize: 25,
          pageCount: 0,
          total: 0,
        },
      },
    };
    const result = makeTutorialsProps('it', emptyData, {});
    expect(result).toHaveLength(0);
  });

  it('should skip tutorials with missing tutorial slug and log error', () => {
    const result = makeTutorialsProps(
      'it',
      tutorialsWithAnItemMissingSlug(),
      {}
    );
    expect(result).toHaveLength(1);
    const firstElement = result[0];
    expect(firstElement.title).toBe('Valid Tutorial');
    expect(firstElement.path).toBe('/it/pago-pa/tutorials/valid-tutorial');
    expect(spyOnConsoleError).toHaveBeenCalledWith(
      'Error while processing Tutorial: missing title or slug. Title: Tutorial Without Slug | Slug: undefined. Skipping...'
    );
  });

  it('should skip tutorials with missing product slug and log error', () => {
    const result = makeTutorialsProps(
      'it',
      tutorialsWithAnItemMissingProductSlug(),
      {}
    );
    expect(result).toHaveLength(1);
    const firstElement = result[0];
    expect(firstElement.title).toBe('Valid Tutorial');
    expect(firstElement.productSlug).toBe('valid-product');
    expect(firstElement.path).toBe(
      '/it/valid-product/tutorials/valid-tutorial'
    );
    expect(spyOnConsoleError).toHaveBeenCalledWith(
      'Error while processing Tutorial with title "Tutorial Without Product Slug": missing product slug. Skipping...'
    );
  });
});

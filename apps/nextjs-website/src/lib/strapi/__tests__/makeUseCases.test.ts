import { spyOnConsoleError } from '@/lib/strapi/__tests__/spyOnConsole';
import _ from 'lodash';
import { makeUseCasesProps } from '../makeProps/makeUseCases';
import { strapiUseCases } from './fixtures/useCases';
import { StrapiUseCases } from '../types/useCase';
import {
  minimalDataUseCases,
  useCasesWithAnItemMissingProductSlug,
  useCasesWithAnItemMissingSlug,
} from './factories/useCases';

describe('makeUseCasesProps', () => {
  afterEach(() => {
    spyOnConsoleError.mockClear();
  });

  afterAll(() => {
    spyOnConsoleError.mockRestore();
  });

  it('should transform strapi use cases to use cases props', () => {
    const result = makeUseCasesProps(strapiUseCases, {});
    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      coverImage: {
        url: 'https://example.com/example.jpg',
        alternativeText: 'Example Image',
      },
      headerImage: {
        url: 'https://example.com/example.jpg',
        alternativeText: 'Example Image',
      },
      title: 'UseCase Title',
      subtitle: 'UseCase Subtitle',
      name: 'UseCase Title',
      path: '/pago-pa/use-cases/use-case-title',
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
    const result = makeUseCasesProps(minimalDataUseCases(), {});
    expect(result).toHaveLength(1);
    const firstElement = result[0];
    expect(firstElement.title).toBe('Minimal Data UseCase');
    expect(firstElement.subtitle).toBe('Minimal Data UseCase Subtitle');
    expect(firstElement.productSlug).toBe('pago-pa');
    expect(firstElement.path).toBe('/pago-pa/use-cases/minimal-data-use-case');
    expect(firstElement.coverImage).toBeUndefined();
    expect(firstElement.headerImage).toBeUndefined();
    expect(firstElement.parts).toEqual([]);
    expect(firstElement.relatedLinks).toBeUndefined();
    expect(firstElement.seo).toBeUndefined();
  });

  it('should handle empty data array', () => {
    const emptyData: StrapiUseCases = {
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
    const result = makeUseCasesProps(emptyData, {});
    expect(result).toHaveLength(0);
  });

  it('should skip use cases with missing use case slug and log error', () => {
    const result = makeUseCasesProps(useCasesWithAnItemMissingSlug(), {});
    expect(result).toHaveLength(1);
    const firstElement = result[0];
    expect(firstElement.title).toBe('Valid UseCase');
    expect(firstElement.path).toBe('/pago-pa/use-cases/valid-use-case');
    expect(spyOnConsoleError).toHaveBeenCalledWith(
      'Error while processing UseCase: missing title or slug. Title: UseCase Without Slug | Slug: undefined. Skipping...'
    );
  });

  it('should skip use cases with missing product slug and log error', () => {
    const result = makeUseCasesProps(
      useCasesWithAnItemMissingProductSlug(),
      {}
    );
    expect(result).toHaveLength(1);
    const firstElement = result[0];
    expect(firstElement.title).toBe('Valid UseCase');
    expect(firstElement.productSlug).toBe('valid-product');
    expect(firstElement.path).toBe('/valid-product/use-cases/valid-use-case');
    expect(spyOnConsoleError).toHaveBeenCalledWith(
      'Error while processing UseCase with title "UseCase Without Product Slug": missing product slug. Skipping...'
    );
  });
});

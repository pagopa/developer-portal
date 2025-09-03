import { makeTutorials } from '@/lib/strapi/makeProps/makeTutorials';
import { StrapiTutorials } from '@/lib/strapi/types/tutorial';
import _ from 'lodash';
import { strapiTutorials } from '@/lib/strapi/__tests__/fixtures/tutorials';
import { minimalDataTutorials } from '@/lib/strapi/__tests__/factories/tutorials';

describe('makeTutorials', () => {
  it('should transform strapi tutorials to tutorials props', () => {
    const result = makeTutorials(_.cloneDeep(strapiTutorials));
    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      image: {
        url: 'https://example.com/example.jpg',
        alternativeText: 'Example Image',
      },
      title: 'Tutorial Title',
      name: 'Tutorial Title',
      path: '/pago-pa/tutorials/tutorial-title',
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
    const result = makeTutorials(_.cloneDeep(minimalDataTutorials()));
    const firstElement = result[0];
    expect(result).toHaveLength(1);
    expect(firstElement.relatedLinks).toBeUndefined();
    expect(firstElement.bannerLinks).toBeDefined();
    expect(firstElement.seo).toBeUndefined();
    expect(firstElement.parts).toEqual([]);
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
    const result = makeTutorials(emptyData);
    expect(result).toHaveLength(0);
  });
});

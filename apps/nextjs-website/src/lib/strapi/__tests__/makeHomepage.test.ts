import { makeHomepageProps } from '@/lib/strapi/makeProps/makeHomepage';
import _ from 'lodash';
import {
  strapiHomepage,
  expectedHomepageProps,
} from '@/lib/strapi/__tests__/fixtures/homepage';
import {
  minimalDataHomepage,
  homepageWithoutNewsShowcase,
  homepageWithoutEcosystem,
  homepageWithoutWebinars,
  homepageWithoutSeo,
} from '@/lib/strapi/__tests__/factories/homepage';

describe('makeHomepageProps', () => {
  it('should transform strapi homepage to homepage props', () => {
    const result = makeHomepageProps(_.cloneDeep(strapiHomepage));
    expect(result).toMatchObject(expectedHomepageProps);
  });

  it('should handle minimal data with missing optional fields', () => {
    const result = makeHomepageProps(minimalDataHomepage());
    expect(result.comingsoonDocumentation.title).toBe('Minimal Documentation');
    expect(result.comingsoonDocumentation.links).toEqual([]);
    expect(result.hero).toHaveLength(1);
    expect(result.hero[0].title).toBe('Minimal Hero');
    expect(result.hero[0].backgroundImage).toBeUndefined();
    expect(result.newsShowcase).toBeUndefined();
    expect(result.ecosystem).toBeUndefined();
    expect(result.webinars).toEqual([]);
    expect(result.seo).toBeUndefined();
  });

  it('should handle homepage without news showcase', () => {
    const result = makeHomepageProps(homepageWithoutNewsShowcase());
    expect(result.newsShowcase).toBeUndefined();
    expect(result.ecosystem).toBeDefined();
    expect(result.webinars).toBeDefined();
  });

  it('should handle homepage without ecosystem', () => {
    const result = makeHomepageProps(homepageWithoutEcosystem());
    expect(result.ecosystem).toBeUndefined();
    expect(result.newsShowcase).toBeDefined();
    expect(result.webinars).toBeDefined();
  });

  it('should handle homepage without webinars', () => {
    const result = makeHomepageProps(homepageWithoutWebinars());
    expect(result.webinars).toEqual([]);
    expect(result.newsShowcase).toBeDefined();
    expect(result.ecosystem).toBeDefined();
  });

  it('should handle homepage without seo', () => {
    const result = makeHomepageProps(homepageWithoutSeo());
    expect(result.seo).toBeUndefined();
    expect(result.newsShowcase).toBeDefined();
    expect(result.ecosystem).toBeDefined();
  });

  it('should correctly map hero slider background images', () => {
    const result = makeHomepageProps(_.cloneDeep(strapiHomepage));
    expect(result.hero[0].backgroundImage).toEqual({
      url: 'https://example.com/example.jpg',
      alternativeText: 'Example Image',
      caption: undefined,
      height: 600,
      width: 800,
      name: 'example.jpg',
      ext: '.jpg',
      mime: 'image/jpeg',
      size: 123456,
    });
  });

  it('should correctly map ecosystem products and solutions', () => {
    const result = makeHomepageProps(_.cloneDeep(strapiHomepage));
    expect(result.ecosystem?.tabContents[0]?.items).toEqual([
      {
        title: 'Product 1',
        text: 'Product 1 description',
        href: 'product-1/overview',
        icon: 'https://example.com/example.jpg',
        useSrc: true,
      },
    ]);
    expect(result.ecosystem?.tabContents[1]?.items).toEqual([
      {
        title: 'Solution 1',
        text: 'Solution 1 description',
        href: '/solutions/solution-1',
        icon: 'https://example.com/example.jpg',
        useSrc: true,
      },
    ]);
  });

  it('should correctly transform news showcase items', () => {
    const result = makeHomepageProps(_.cloneDeep(strapiHomepage));
    expect(result.newsShowcase?.items).toHaveLength(3);
    expect(result.newsShowcase?.items[0]).toMatchObject({
      title:
        "Usa il validatore di SEND per fare una verifica sull'integrazione",
      comingSoon: false,
      label: 'Label',
      link: {
        text: 'Vai al validatore',
        url: '/send/guides/validatore',
        target: '_self',
      },
    });
  });
});

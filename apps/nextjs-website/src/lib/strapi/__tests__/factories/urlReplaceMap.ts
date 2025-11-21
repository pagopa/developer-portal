import {
  StrapiUrlReplaceMap,
  StrapiUrlToGuide,
} from '@/lib/strapi/types/urlReplaceMap';

const makeUrlToGuideItem = (
  overrides?: Partial<StrapiUrlToGuide>
): StrapiUrlToGuide => ({
  id: 1,
  url: 'source-url',
  subPath: 'sub',
  guide: {
    title: 'Guide title',
    slug: 'guide-slug',
    product: {
      slug: 'product-slug',
    },
  },
  ...overrides,
});

export const urlReplaceMapSingle = (
  overrides?: Partial<StrapiUrlToGuide>
): StrapiUrlReplaceMap => ({
  urlToGuide: [makeUrlToGuideItem(overrides)],
});

export const urlReplaceMapMultiple = (): StrapiUrlReplaceMap => ({
  urlToGuide: [
    makeUrlToGuideItem({ id: 1, url: 'a', subPath: undefined }),
    makeUrlToGuideItem({
      id: 2,
      url: 'b',
      subPath: 'x',
      guide: {
        title: 'T',
        slug: 's-2',
        product: { slug: 'p-2' },
      },
    }),
  ],
});

export const urlReplaceMapWithUndefinedGuide = (): StrapiUrlReplaceMap => ({
  urlToGuide: [makeUrlToGuideItem({ guide: undefined })],
});

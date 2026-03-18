import {
  StrapiUrlReplaceMap,
  StrapiUrlToGuide,
} from '@/lib/strapi/types/urlReplaceMap';
import { wrapAsRootEntity } from '@/lib/strapi/__tests__/strapiEntityWrappers';

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

export const urlReplaceMapSingle = (overrides?: Partial<StrapiUrlToGuide>) =>
  wrapAsRootEntity<StrapiUrlReplaceMap>({
    urlToGuide: [makeUrlToGuideItem(overrides)],
  });

export const urlReplaceMapMultiple = () =>
  wrapAsRootEntity<StrapiUrlReplaceMap>({
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

export const urlReplaceMapWithUndefinedGuide = () =>
  wrapAsRootEntity<StrapiUrlReplaceMap>({
    urlToGuide: [makeUrlToGuideItem({ guide: undefined })],
  });

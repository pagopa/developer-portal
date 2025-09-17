import {
  StrapiUrlReplaceMap,
  StrapiUrlToGuide
} from '@/lib/strapi/types/urlReplaceMap';

const makeUrlToGuideItem = (
  overrides?: Partial<StrapiUrlToGuide>
): StrapiUrlToGuide => ({
  id: 1,
  url: 'source-url',
  subPath: 'sub',
  guide: {
    data: {
      attributes: {
        title: 'Guide title',
        slug: 'guide-slug',
        product: {
          data: {
            attributes: {
              slug: 'product-slug'
            }
          }
        }
      }
    }
  },
  ...overrides
});

export const urlReplaceMapSingle = (
  overrides?: Partial<StrapiUrlToGuide>
): StrapiUrlReplaceMap => ({
  data: {
    attributes: {
      urlToGuide: [makeUrlToGuideItem(overrides)]
    }
  }
});

export const urlReplaceMapMultiple = (): StrapiUrlReplaceMap => ({
  data: {
    attributes: {
      urlToGuide: [
        makeUrlToGuideItem({ id: 1, url: 'a', subPath: undefined }),
        makeUrlToGuideItem({
          id: 2,
          url: 'b',
          subPath: 'x',
          guide: {
            data: {
              attributes: {
                title: 'T',
                slug: 's-2',
                product: { data: { attributes: { slug: 'p-2' } } }
              }
            }
          }
        })
      ]
    }
  }
});

export const urlReplaceMapWithUndefinedGuide = (): StrapiUrlReplaceMap => ({
  data: {
    attributes: {
      urlToGuide: [makeUrlToGuideItem({ guide: { data: undefined } })]
    }
  }
});

import { GuideDefinition } from '@/_contents/makeDocs';
import { StrapiGuides } from '../codecs/GuidesCodec';
import { mergeProductWithStaticContent } from './makeProducts';

type StaticGuides = readonly GuideDefinition[];

export function makeGuidesProps(
  strapiGuides: StrapiGuides,
  staticGuides: StaticGuides
): readonly GuideDefinition[] {
  return [
    ...strapiGuides.data.map(({ attributes }) => {
      const product = mergeProductWithStaticContent(
        attributes.product.data.attributes
      );
      return {
        product,
        guide: {
          name: attributes.title,
          slug: attributes.slug,
        },
        versions: attributes.versions,
        bannerLinks: product.bannerLinks,
      };
    }),
    ...staticGuides,
  ];
}

import { GuideDefinition } from '@/helpers/makeDocs.helpers';
import { StrapiGuides } from '../codecs/GuidesCodec';
import { makeBannerLinkProps } from '@/lib/strapi/makeProps/makeBannerLink';
import { makeBaseProductWithoutLogoProps } from './makeProducts';

export function makeGuidesProps(
  strapiGuides: StrapiGuides
): readonly GuideDefinition[] {
  return strapiGuides.data.map(({ attributes }) => {
    const product = makeBaseProductWithoutLogoProps(attributes.product.data);

    return {
      product,
      guide: {
        name: attributes.title,
        slug: attributes.slug,
      },
      versions: attributes.versions,
      bannerLinks:
        attributes.bannerLinks.length > 0
          ? attributes.bannerLinks.map(makeBannerLinkProps)
          : attributes.product.data.attributes.bannerLinks?.map(
              makeBannerLinkProps
            ) || [],
      seo: attributes.seo,
    };
  });
}

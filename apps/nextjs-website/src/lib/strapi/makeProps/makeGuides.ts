import { GuideDefinition } from '@/_contents/makeDocs';
import { StrapiGuides } from '../codecs/GuidesCodec';
import { makeBannerLinkProps } from '@/lib/strapi/makeProps/makeBannerLink';

export function makeGuidesProps(
  strapiGuides: StrapiGuides
): readonly GuideDefinition[] {
  return strapiGuides.data.map(({ attributes }) => {
    const product = {
      ...attributes.product.data.attributes,
      description: '',
      bannerLinks:
        attributes.product.data.attributes.bannerLinks?.map(
          makeBannerLinkProps
        ) || [],
    };

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

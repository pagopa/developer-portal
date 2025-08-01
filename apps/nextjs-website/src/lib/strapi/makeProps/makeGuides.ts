import { GuideDefinition } from '@/helpers/makeDocs.helpers';
import { makeBannerLinkProps } from '@/lib/strapi/makeProps/makeBannerLink';
import { makeBaseProductWithoutLogoProps } from './makeProducts';
import { StrapiGuidesPaginated } from '@/lib/strapi/types/guide';

export function makeGuidesProps(
  strapiGuides: StrapiGuidesPaginated
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

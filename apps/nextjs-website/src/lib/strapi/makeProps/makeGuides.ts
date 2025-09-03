import { GuideDefinition } from '@/helpers/makeDocs.helpers';
import { makeBannerLink } from '@/lib/strapi/makeProps/makeBannerLink';
import { makeBaseProductWithoutLogo } from './makeProducts';
import { StrapiGuides } from '@/lib/strapi/types/guide';

export function makeGuides(
  strapiGuides: StrapiGuides
): readonly GuideDefinition[] {
  return strapiGuides.data.map(({ attributes }) => {
    const product = makeBaseProductWithoutLogo(attributes.product.data);

    return {
      product,
      guide: {
        name: attributes.title,
        slug: attributes.slug,
      },
      versions: attributes.versions,
      bannerLinks:
        attributes.bannerLinks.length > 0
          ? attributes.bannerLinks.map(makeBannerLink)
          : attributes.product.data.attributes.bannerLinks?.map(
              makeBannerLink
            ) || [],
      seo: attributes.seo || undefined,
    };
  });
}

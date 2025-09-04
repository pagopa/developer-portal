/* eslint-disable functional/no-try-statements */
/* eslint-disable functional/no-expression-statements */
import { GuideDefinition } from '@/helpers/makeDocs.helpers';
import { makeBannerLink } from '@/lib/strapi/makeProps/makeBannerLink';
import { makeBaseProductWithoutLogo } from './makeProducts';
import { StrapiGuides } from '@/lib/strapi/types/guide';
import _ from 'lodash';

export function makeGuides(
  strapiGuides: StrapiGuides
): readonly GuideDefinition[] {
  return _.compact(
    strapiGuides.data.map(({ attributes }) => {
      if (!attributes.slug) {
        console.error('guide slug is missing:', attributes);
        return null;
      }

      if (!attributes.product.data.attributes.slug) {
        console.error('product slug is missing:', attributes.product.data);
        return null;
      }

      try {
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
          seo: attributes.seo,
        };
      } catch (error) {
        console.error(
          'error creating guide definition for:',
          attributes,
          error
        );
        return null;
      }
    })
  );
}

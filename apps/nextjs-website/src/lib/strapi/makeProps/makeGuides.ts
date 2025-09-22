/* eslint-disable functional/no-try-statements */
/* eslint-disable functional/no-expression-statements */
import { GuideDefinition } from '@/helpers/makeDocs.helpers';
import { makeBannerLink } from '@/lib/strapi/makeProps/makeBannerLink';
import { makeBaseProductWithoutLogo } from './makeProducts';
import { StrapiGuides } from '@/lib/strapi/types/guide';
import { compact } from 'lodash';

export function makeGuides(
  strapiGuides: StrapiGuides
): readonly GuideDefinition[] {
  return compact(
    strapiGuides.data.map(({ attributes }) => {
      if (!attributes.slug || !attributes.title) {
        console.error(
          `Error while processing Guide: missing title or slug. Title: ${attributes.title} | Slug: ${attributes.slug}. Skipping...`
        );
        return null;
      }

      if (!attributes.product.data?.attributes.slug) {
        console.error(
          `Error while processing Guide with name "${attributes.title}": missing the product slug. Skipping...`
        );
        return null;
      }

      try {
        const product = makeBaseProductWithoutLogo(
          attributes.product.data
        );
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
          `Error while processing guide with slug "${attributes.slug}":`,
          error,
          'Skipping...'
        );
        return null;
      }
    })
  );
}

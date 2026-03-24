/* eslint-disable functional/no-try-statements */
/* eslint-disable functional/no-expression-statements */
import { makeBannerLinkProps } from '@/lib/strapi/makeProps/makeBannerLink';
import { makeBaseProductWithoutLogoProps } from '@/lib/product/mapper';
import { compact } from 'lodash';
import type { StrapiGuides } from './types';
import { GuideDefinition } from '../../helpers/makeDocs.helpers';

export function mapGuides(
  locale: string,
  strapiGuides: StrapiGuides
): readonly GuideDefinition[] {
  return compact(
    strapiGuides.data.map((attributes) => {
      if (!attributes.slug || !attributes.title) {
        console.error(
          `Error while processing Guide: missing title or slug. Title: ${attributes.title} | Slug: ${attributes.slug}. Skipping...`
        );
        return null;
      }

      if (!attributes.product?.slug) {
        console.error(
          `Error while processing Guide with name "${attributes.title}": missing the product slug. Skipping...`
        );
        return null;
      }

      try {
        const product = makeBaseProductWithoutLogoProps(
          locale,
          attributes.product
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
              ? attributes.bannerLinks.map(makeBannerLinkProps)
              : attributes.product.bannerLinks?.map(makeBannerLinkProps) || [],
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

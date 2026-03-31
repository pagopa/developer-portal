/* eslint-disable functional/no-try-statements */
/* eslint-disable functional/no-expression-statements */
import { mapBannerLinkProps } from '@/lib/bannerLink/mapper';
import { makeBaseProductWithoutLogoProps } from '@/lib/products/mapper';
import { compact } from 'lodash';
import type { StrapiGuides } from './strapiTypes';
import type { Guide } from './types';

export function mapGuides(
  locale: string,
  strapiGuides: StrapiGuides
): readonly Guide[] {
  return compact(
    strapiGuides.data.map((guide) => {
      if (!guide.slug || !guide.title) {
        console.error(
          `Error while processing Guide: missing title or slug. Title: ${guide.title} | Slug: ${guide.slug}. Skipping...`
        );
        return null;
      }

      if (!guide.product?.slug) {
        console.error(
          `Error while processing Guide with name "${guide.title}": missing the product slug. Skipping...`
        );
        return null;
      }

      try {
        const product = makeBaseProductWithoutLogoProps(locale, guide.product);
        return {
          product,
          guide: {
            name: guide.title,
            slug: guide.slug,
          },
          versions: guide.versions,
          bannerLinks:
            guide.bannerLinks.length > 0
              ? guide.bannerLinks.map(mapBannerLinkProps)
              : guide.product.bannerLinks?.map(mapBannerLinkProps) || [],
          seo: guide.seo,
        };
      } catch (error) {
        console.error(
          `Error while processing guide with slug "${guide.slug}":`,
          error,
          'Skipping...'
        );
        return null;
      }
    })
  );
}

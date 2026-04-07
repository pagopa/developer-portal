/* eslint-disable functional/no-try-statements */
/* eslint-disable functional/no-expression-statements */
import { mapBannerLinkProps } from '@/lib/bannerLink/mapper';
import { makeBaseProductWithoutLogoProps } from '@/lib/products/mapper';
import { ReleaseNotePageProps } from '@/app/[locale]/[productSlug]/release-note/[[...releaseNoteSubPathSlugs]]/page';
import { StrapiReleaseNotes } from '@/lib/strapi/types/releaseNotes';
import { compact } from 'lodash';

export function makeReleaseNotesProps(
  locale: string,
  strapiReleaseNotes: StrapiReleaseNotes
): ReadonlyArray<ReleaseNotePageProps> {
  return compact(
    strapiReleaseNotes.data.map((attributes) => {
      if (!attributes.product?.slug) {
        console.error(
          `Error while processing ReleaseNote with title "${attributes.title}": missing product slug. Skipping...`
        );
        return null;
      }

      try {
        return {
          bannerLinks:
            attributes.bannerLinks.length > 0
              ? attributes.bannerLinks.map(mapBannerLinkProps)
              : attributes.product?.bannerLinks?.map(mapBannerLinkProps),
          dirName: attributes.dirName,
          landingFile: attributes.landingFile,
          path: `/${locale}/${attributes.product?.slug}/release-note`,
          product: makeBaseProductWithoutLogoProps(locale, attributes.product),
          seo: attributes.seo,
          title: attributes.title,
        };
      } catch (error) {
        // eslint-disable-next-line functional/no-expression-statements
        console.error(
          `Error while processing ReleaseNote with title ${attributes.title}`,
          error,
          'Skipping...'
        );
        return null;
      }
    })
  );
}

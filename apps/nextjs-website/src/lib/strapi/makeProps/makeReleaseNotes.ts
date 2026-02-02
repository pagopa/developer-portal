/* eslint-disable functional/no-try-statements */
/* eslint-disable functional/no-expression-statements */
import { makeBannerLinkProps } from '@/lib/strapi/makeProps/makeBannerLink';
import { makeBaseProductWithoutLogoProps } from '@/lib/strapi/makeProps/makeProducts';
import { ReleaseNotePageProps } from '@/app/[productSlug]/release-note/[[...releaseNoteSubPathSlugs]]/page';
import { StrapiReleaseNotes } from '@/lib/strapi/types/releaseNotes';
import { compact } from 'lodash';

export function makeReleaseNotesProps(
  strapiReleaseNotes: StrapiReleaseNotes
): ReadonlyArray<ReleaseNotePageProps> {
  return compact(
    strapiReleaseNotes.data.map(({ attributes }) => {
      if (!attributes.product.data?.attributes.slug) {
        console.error(
          `Error while processing ReleaseNote with title "${attributes.title}": missing product slug. Skipping...`
        );
        return null;
      }

      try {
        return {
          bannerLinks:
            attributes.bannerLinks.length > 0
              ? attributes.bannerLinks.map(makeBannerLinkProps)
              : attributes.product.data?.attributes.bannerLinks?.map(
                  makeBannerLinkProps
                ),
          dirName: attributes.dirName,
          landingFile: attributes.landingFile,
          path: `/${attributes.product.data?.attributes.slug}/release-note`,
          product: makeBaseProductWithoutLogoProps(attributes.product.data),
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

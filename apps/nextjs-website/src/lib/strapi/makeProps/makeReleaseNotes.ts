/* eslint-disable functional/no-try-statements */
/* eslint-disable functional/no-expression-statements */
import { makeBannerLink } from '@/lib/strapi/makeProps/makeBannerLink';
import { makeBaseProductWithoutLogo } from '@/lib/strapi/makeProps/makeProducts';
import { ReleaseNotePagePropsData } from '@/app/[productSlug]/[...releaseNoteSubPathSlugs]/page';
import { StrapiReleaseNotes } from '@/lib/strapi/types/releaseNotes';
import { compact } from 'lodash';

export function makeReleaseNotes(
  strapiReleaseNotes: StrapiReleaseNotes
): readonly ReleaseNotePagePropsData[] {
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
              ? attributes.bannerLinks.map(makeBannerLink)
              : attributes.product.data?.attributes.bannerLinks?.map(
                  makeBannerLink
                ),
          dirName: attributes.dirName,
          landingFile: attributes.landingFile,
          path: `/${attributes.product.data?.attributes.slug}/release-note`,
          product: makeBaseProductWithoutLogo(attributes.product.data),
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

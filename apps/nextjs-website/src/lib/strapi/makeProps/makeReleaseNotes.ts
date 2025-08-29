import { makeBannerLinkProps } from '@/lib/strapi/makeProps/makeBannerLink';
import { makeBaseProductWithoutLogoProps } from '@/lib/strapi/makeProps/makeProducts';
import { ReleaseNotePageProps } from '@/app/[productSlug]/[...releaseNoteSubPathSlugs]/page';
import { StrapiReleaseNotes } from '@/lib/strapi/types/releaseNotes';
import _ from 'lodash';

export function makeReleaseNotesProps(
  strapiReleaseNotes: StrapiReleaseNotes
): ReadonlyArray<ReleaseNotePageProps> {
  return _.compact(
    strapiReleaseNotes.data.map(({ attributes }) => {
      if (!attributes.product.data) {
        // eslint-disable-next-line functional/no-expression-statements
        console.error(
          `Release note "${attributes.title}" is missing the associated product. Skipping...`
        );
        return null;
      }

      // eslint-disable-next-line functional/no-try-statements
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
          `Error while making release note props for ${attributes.title}`,
          error
        );
        return null;
      }
    })
  );
}

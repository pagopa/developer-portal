import { makeBannerLinkProps } from '@/lib/strapi/makeProps/makeBannerLink';
import { makeBaseProductWithoutLogoProps } from './makeProducts';
import { ReleaseNotePageProps } from '@/app/[productSlug]/[...releaseNoteSubPathSlugs]/page';
import { StrapiReleaseNotes } from '../types/releaseNotes';

export function makeReleaseNotesProps(
  strapiReleaseNotes: StrapiReleaseNotes
): ReadonlyArray<ReleaseNotePageProps> {
  return strapiReleaseNotes.data.map(({ attributes }) => ({
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
  }));
}

/* eslint-disable functional/no-try-statements */
/* eslint-disable functional/no-expression-statements */
import { mapBannerLinkProps } from '@/lib/bannerLink/mapper';
import { makeBaseProductWithoutLogoProps } from '@/lib/products/mapper';
import { ReleaseNotePageProps } from '@/app/[locale]/[productSlug]/release-note/[[...releaseNoteSubPathSlugs]]/page';
import { compact } from 'lodash';
import { StrapiReleaseNote, StrapiReleaseNotes } from './types';

export function mapReleaseNotesProps(
  locale: string,
  strapiReleaseNotes: StrapiReleaseNotes
): ReadonlyArray<ReleaseNotePageProps> {
  return compact(
    strapiReleaseNotes.data.map((attributes) =>
      mapReleaseNoteProps(locale, attributes)
    )
  );
}

export function mapReleaseNoteProps(
  locale: string,
  attributes: StrapiReleaseNote
): ReleaseNotePageProps | null {
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
      path: `/${locale}/${attributes.product.slug}/release-note`,
      product: makeBaseProductWithoutLogoProps(locale, attributes.product),
      seo: attributes.seo,
      title: attributes.title,
    };
  } catch (error) {
    console.error(
      `Error while processing ReleaseNote with title ${attributes.title}`,
      error,
      'Skipping...'
    );
    return null;
  }
}

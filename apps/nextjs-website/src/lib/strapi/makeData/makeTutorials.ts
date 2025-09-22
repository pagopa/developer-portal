/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-try-statements */
import { PartData } from '@/lib/types/part';
import { Tutorial } from '@/lib/types/tutorialData';
import { makePart } from '@/lib/strapi/makeData/makePart';
import { BannerLinkData } from '@/components/atoms/BannerLink/BannerLink';
import { RelatedLinksProps } from '@/components/atoms/RelatedLinks/RelatedLinks';
import { makeBannerLink } from '@/lib/strapi/makeData/makeBannerLink';
import { StrapiTutorials } from '@/lib/strapi/types/tutorial';
import { compact } from 'lodash';

export type TutorialData = Tutorial & {
  readonly productSlug: string;
  readonly relatedLinks?: RelatedLinksProps;
  readonly bannerLinks?: readonly BannerLinkData[];
};

export function makeTutorials(
  strapiTutorials: StrapiTutorials
): readonly TutorialData[] {
  return compact(
    strapiTutorials.data.map(({ attributes }) => {
      if (!attributes.slug || !attributes.title) {
        console.error(
          `Error while processing Tutorial: missing title or slug. Title: ${attributes.title} | Slug: ${attributes.slug}. Skipping...`
        );
        return null;
      }

      if (!attributes.product.data.attributes.slug) {
        console.error(
          `Error while processing Tutorial with title "${attributes.title}": missing product slug. Skipping...`
        );
        return null;
      }

      try {
        return {
          image: attributes.image.data
            ? {
                url: attributes.image.data.attributes.url,
                alternativeText:
                  attributes.image.data.attributes.alternativeText || '',
              }
            : undefined,
          title: attributes.title,
          publishedAt: attributes.publishedAt
            ? new Date(attributes.publishedAt)
            : undefined,
          name: attributes.title,
          path: `/${attributes.product.data.attributes.slug}/tutorials/${attributes.slug}`,
          parts: [
            ...(attributes.parts
              .map((part) => makePart(part))
              .filter((part) => !!part) as ReadonlyArray<PartData>),
          ],
          productSlug: attributes.product.data.attributes.slug,
          relatedLinks: attributes.relatedLinks as RelatedLinksProps,
          bannerLinks:
            attributes.bannerLinks && attributes.bannerLinks.length > 0
              ? attributes.bannerLinks?.map(makeBannerLink)
              : attributes.product.data?.attributes.bannerLinks?.map(
                  makeBannerLink
                ),
          seo: attributes.seo,
          updatedAt: attributes.updatedAt,
        } satisfies TutorialData;
      } catch (error) {
        console.error(
          `Error while processing Tutorial with title ${attributes.title}:`,
          error,
          'Skipping...'
        );
        return null;
      }
    })
  );
}

import { Part } from '@/lib/types/part';
import { Tutorial } from '@/lib/types/tutorialData';
import { makePart } from '@/lib/strapi/makeProps/makePart';
import { BannerLinkProps } from '@/components/atoms/BannerLink/BannerLink';
import { RelatedLinksProps } from '@/components/atoms/RelatedLinks/RelatedLinks';
import { makeBannerLink } from '@/lib/strapi/makeProps/makeBannerLink';
import { StrapiTutorials } from '@/lib/strapi/types/tutorial';
import _ from 'lodash';

export type TutorialProps = Tutorial & {
  readonly productSlug: string;
  readonly relatedLinks?: RelatedLinksProps;
  readonly bannerLinks?: readonly BannerLinkProps[];
};

export function makeTutorials(
  strapiTutorials: StrapiTutorials
): readonly TutorialProps[] {
  return _.compact(
    strapiTutorials.data.map(({ attributes }) => {
      // eslint-disable-next-line functional/no-try-statements
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
              .filter((part) => !!part) as ReadonlyArray<Part>),
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
        } satisfies TutorialProps;
      } catch (error) {
        // eslint-disable-next-line functional/no-expression-statements
        console.error(
          `Error while making tutorial props for ${attributes.title}:`,
          error
        );
        return null;
      }
    })
  );
}

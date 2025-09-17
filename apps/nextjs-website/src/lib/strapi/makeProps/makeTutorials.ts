/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-try-statements */
import { Part } from '@/lib/types/part';
import { Tutorial } from '@/lib/types/tutorialData';
import { makePartProps } from '@/lib/strapi/makeProps/makePart';
import { BannerLinkProps } from '@/components/atoms/BannerLink/BannerLink';
import { RelatedLinksProps } from '@/components/atoms/RelatedLinks/RelatedLinks';
import { makeBannerLinkProps } from '@/lib/strapi/makeProps/makeBannerLink';
import { StrapiTutorials } from '@/lib/strapi/types/tutorial';
import _ from 'lodash';

export type TutorialProps = Tutorial & {
  readonly productSlug: string;
  readonly relatedLinks?: RelatedLinksProps;
  readonly bannerLinks?: readonly BannerLinkProps[];
};

export function makeTutorialsProps(
  strapiTutorials: StrapiTutorials
): readonly TutorialProps[] {
  return _.compact(
    strapiTutorials.data.map(({ attributes }) => {
      if (!attributes.slug) {
        console.error(
          `Error processing Tutorial "${attributes.title}": Missing tutorial slug. Skipping...`
        );
        return null;
      }

      if (!attributes.product.data.attributes.slug) {
        console.error(
          `Error processing Tutorial "${attributes.title}": Missing product slug. Skipping...`
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
              .map((part) => makePartProps(part))
              .filter((part) => !!part) as ReadonlyArray<Part>),
          ],
          productSlug: attributes.product.data.attributes.slug,
          relatedLinks: attributes.relatedLinks as RelatedLinksProps,
          bannerLinks:
            attributes.bannerLinks && attributes.bannerLinks.length > 0
              ? attributes.bannerLinks?.map(makeBannerLinkProps)
              : attributes.product.data?.attributes.bannerLinks?.map(
                  makeBannerLinkProps
                ),
          seo: attributes.seo,
          tags: attributes.tags.data?.map((tag) => tag.attributes) || [],
          updatedAt: attributes.updatedAt,
        } satisfies TutorialProps;
      } catch (error) {
        console.error(
          `Error while making tutorial props for ${attributes.title}:`,
          error
        );
        return null;
      }
    })
  );
}

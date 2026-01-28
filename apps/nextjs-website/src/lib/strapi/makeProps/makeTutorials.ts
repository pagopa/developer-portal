/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-try-statements */
import { Tutorial } from '@/lib/types/tutorialData';
import { makePartProps } from '@/lib/strapi/makeProps/makePart';
import { BannerLinkProps } from '@/components/atoms/BannerLink/BannerLink';
import { RelatedLinksProps } from '@/components/atoms/RelatedLinks/RelatedLinks';
import { makeBannerLinkProps } from '@/lib/strapi/makeProps/makeBannerLink';
import { StrapiTutorials } from '@/lib/strapi/types/tutorial';
import { compact } from 'lodash';

export type TutorialProps = Tutorial & {
  readonly productSlug: string;
  readonly relatedLinks?: RelatedLinksProps;
  readonly bannerLinks?: readonly BannerLinkProps[];
};
export function makeTutorialsProps(
  strapiTutorials: StrapiTutorials,
  markdownContentDict: Record<string, string>
): readonly TutorialProps[] {
  return compact(
    strapiTutorials.data.map((attributes) => {
      // Controllo esistenza campi obbligatori minimi
      if (!attributes.slug || !attributes.title) {
        console.error(
          `Error while processing Tutorial: missing title or slug. Title: ${attributes.title} | Slug: ${attributes.slug}. Skipping...`
        );
        return null;
      }

      // Controllo esistenza product
      if (!attributes.product?.slug) {
        console.error(
          `Error while processing Tutorial with title "${attributes.title}": missing product slug. Skipping...`
        );
        return null;
      }

      try {
        return {
          image: attributes.image
            ? {
                url: attributes.image.url,
                alternativeText: attributes.image.alternativeText || '',
              }
            : undefined,

          title: attributes.title,

          publishedAt: attributes.publishedAt
            ? new Date(attributes.publishedAt)
            : undefined,

          name: attributes.title,

          path: `/${attributes.product.slug}/tutorials/${attributes.slug}`,

          parts: compact(
            attributes.parts?.map((part) =>
              makePartProps(part, markdownContentDict)
            ) || []
          ),

          productSlug: attributes.product.slug,

          description: attributes.description || '',

          icon: attributes.icon || undefined,

          relatedLinks: attributes.relatedLinks,

          bannerLinks:
            attributes.bannerLinks && attributes.bannerLinks.length > 0
              ? attributes.bannerLinks.map(makeBannerLinkProps)
              : attributes.product.bannerLinks?.map(makeBannerLinkProps),

          seo: attributes.seo,

          tags: attributes.tags?.map((tag) => tag) || [],

          updatedAt: attributes.updatedAt,
        } satisfies TutorialProps;
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

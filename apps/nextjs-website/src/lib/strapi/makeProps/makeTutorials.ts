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
    strapiTutorials.data.map(({ attributes }) => {
      // Checking mandatory fields
      if (!attributes.slug || !attributes.title) {
        console.error(
          `Error while processing Tutorial: missing title or slug. Title: ${attributes.title} | Slug: ${attributes.slug}. Skipping...`
        );
        return null;
      }

      // Controllo esistenza product
      if (!attributes.product?.data?.attributes?.slug) {
        console.error(
          `Error while processing Tutorial with title "${attributes.title}": missing product slug. Skipping...`
        );
        return null;
      }

      try {
        return {
          // FIX 1: Aggiunto controllo su attributes.image con ?.
          image: attributes.image?.data
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

          // FIX 2: Aggiunto controllo su attributes.parts con ?. e fallback ad array vuoto
          parts: compact(
            attributes.parts?.map((part) =>
              makePartProps(part, markdownContentDict)
            ) || []
          ),

          productSlug: attributes.product.data.attributes.slug,

          description: attributes.description || '',

          // FIX 3: Aggiunto controllo su attributes.icon
          icon: attributes.icon?.data?.attributes || undefined,

          relatedLinks: attributes.relatedLinks,

          bannerLinks:
            attributes.bannerLinks && attributes.bannerLinks.length > 0
              ? attributes.bannerLinks.map(makeBannerLinkProps)
              : attributes.product.data.attributes.bannerLinks?.map(
                  makeBannerLinkProps
                ),

          seo: attributes.seo,

          // FIX 4: Aggiunto controllo su attributes.tags e attributes.tags.data
          tags: attributes.tags?.data?.map((tag) => tag.attributes) || [],

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

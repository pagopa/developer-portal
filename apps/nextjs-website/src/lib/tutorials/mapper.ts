/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-try-statements */
import { mapPartProps } from '@/lib/parts/mapper';
import { mapBannerLinkProps } from '@/lib/bannerLink/mapper';
import { compact } from 'lodash';
import { StrapiTutorials, TutorialProps } from './strapiTypes';

export function mapTutorialsProps(
  locale: string,
  strapiTutorials: StrapiTutorials,
  markdownContentDict: Record<string, string>
): readonly TutorialProps[] {
  return compact(
    strapiTutorials.data.map((attributes) => {
      if (!attributes.slug || !attributes.title) {
        console.error(
          `Error while processing Tutorial: missing title or slug. Title: ${attributes.title} | Slug: ${attributes.slug}. Skipping...`
        );
        return null;
      }

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
          path: `/${locale}/${attributes.product.slug}/tutorials/${attributes.slug}`,
          parts: compact(
            attributes.parts?.map((part) =>
              mapPartProps(part, markdownContentDict)
            ) || []
          ),
          productSlug: attributes.product.slug,
          description: attributes.description || '',
          icon: attributes.icon || undefined,
          relatedLinks: attributes.relatedLinks,
          bannerLinks:
            attributes.bannerLinks && attributes.bannerLinks.length > 0
              ? attributes.bannerLinks.map(mapBannerLinkProps)
              : attributes.product.bannerLinks?.map(mapBannerLinkProps),
          seo: attributes.seo,
          tags: attributes.tags?.map((tag) => tag) || [],
          updatedAt: attributes.updatedAt,
          redirectPath: attributes.redirectPath,
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

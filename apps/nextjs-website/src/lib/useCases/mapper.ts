/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-try-statements */
import { mapPartProps } from '@/lib/parts/mapper';
import { mapBannerLinkProps } from '@/lib/bannerLink/mapper';
import { compact } from 'lodash';
import { StrapiUseCases, UseCaseProps } from './strapiTypes';

export function mapUseCasesProps(
  locale: string,
  strapiUseCases: StrapiUseCases,
  markdownContentDict: Record<string, string>
): readonly UseCaseProps[] {
  return compact(
    strapiUseCases.data.map((attributes) => {
      if (!attributes.slug || !attributes.title) {
        console.error(
          `Error while processing UseCase: missing title or slug. Title: ${attributes.title} | Slug: ${attributes.slug}. Skipping...`
        );
        return null;
      }

      if (!attributes.product.slug) {
        console.error(
          `Error while processing UseCase with title "${attributes.title}": missing product slug. Skipping...`
        );
        return null;
      }

      try {
        return {
          coverImage: attributes.coverImage
            ? {
                url: attributes.coverImage.url,
                alternativeText: attributes.coverImage.alternativeText || '',
              }
            : undefined,
          headerImage: attributes.headerImage
            ? {
                url: attributes.headerImage.url,
                alternativeText: attributes.headerImage.alternativeText || '',
              }
            : undefined,
          title: attributes.title,
          publishedAt: attributes.publishedAt
            ? new Date(attributes.publishedAt)
            : undefined,
          name: attributes.title,
          path: `/${locale}/${attributes.product.slug}/use-cases/${attributes.slug}`,
          parts: compact(
            attributes.parts.map((part) =>
              mapPartProps(part, markdownContentDict)
            )
          ),
          productSlug: attributes.product.slug,
          relatedLinks: attributes.relatedLinks,
          bannerLinks:
            attributes.bannerLinks && attributes.bannerLinks.length > 0
              ? attributes.bannerLinks.map(mapBannerLinkProps)
              : attributes.product.bannerLinks?.map(mapBannerLinkProps),
          seo: attributes.seo,
          subtitle: attributes.subtitle,
          tags: attributes.tags?.map((tag) => tag) || [],
          updatedAt: attributes.updatedAt,
        } satisfies UseCaseProps;
      } catch (error) {
        console.error(
          `Error while processing UseCase with title ${attributes.title}:`,
          error,
          'Skipping...'
        );
        return null;
      }
    })
  );
}

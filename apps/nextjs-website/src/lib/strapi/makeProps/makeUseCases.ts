/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-try-statements */
import { makePartProps } from '@/lib/strapi/makeProps/makePart';
import { BannerLinkProps } from '@/components/atoms/BannerLink/BannerLink';
import { RelatedLinksProps } from '@/components/atoms/RelatedLinks/RelatedLinks';
import { makeBannerLinkProps } from '@/lib/strapi/makeProps/makeBannerLink';
import { compact } from 'lodash';
import { StrapiUseCases } from '@/lib/strapi/types/useCase';
import { UseCase } from '@/lib/types/useCaseData';

export type UseCaseProps = UseCase & {
  readonly productSlug: string;
  readonly relatedLinks?: RelatedLinksProps;
  readonly bannerLinks?: readonly BannerLinkProps[];
};

export function makeUseCasesProps(
  locale: string,
  strapiUseCases: StrapiUseCases,
  markdownContentDict: Record<string, string>
): readonly UseCaseProps[] {
  return compact(
    strapiUseCases.data.map(({ attributes }) => {
      if (!attributes.slug || !attributes.title) {
        console.error(
          `Error while processing UseCase: missing title or slug. Title: ${attributes.title} | Slug: ${attributes.slug}. Skipping...`
        );
        return null;
      }

      if (!attributes.product.data.attributes.slug) {
        console.error(
          `Error while processing UseCase with title "${attributes.title}": missing product slug. Skipping...`
        );
        return null;
      }

      try {
        return {
          coverImage: attributes.coverImage.data
            ? {
                url: attributes.coverImage.data.attributes.url,
                alternativeText:
                  attributes.coverImage.data.attributes.alternativeText || '',
              }
            : undefined,
          headerImage: attributes.headerImage?.data
            ? {
                url: attributes.headerImage.data.attributes.url,
                alternativeText:
                  attributes.headerImage.data.attributes.alternativeText || '',
              }
            : undefined,
          title: attributes.title,
          publishedAt: attributes.publishedAt
            ? new Date(attributes.publishedAt)
            : undefined,
          name: attributes.title,
          path: `/${locale}/${attributes.product.data.attributes.slug}/use-cases/${attributes.slug}`,
          parts: compact(
            attributes.parts.map((part) =>
              makePartProps(part, markdownContentDict)
            )
          ),
          productSlug: attributes.product.data.attributes.slug,
          relatedLinks: attributes.relatedLinks,
          bannerLinks:
            attributes.bannerLinks && attributes.bannerLinks.length > 0
              ? attributes.bannerLinks?.map(makeBannerLinkProps)
              : attributes.product.data?.attributes.bannerLinks?.map(
                  makeBannerLinkProps
                ),
          seo: attributes.seo,
          subtitle: attributes.subtitle,
          tags: attributes.tags.data?.map((tag) => tag.attributes) || [],
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

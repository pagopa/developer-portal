/* eslint-disable functional/no-expression-statements */
import { makeBannerLinkProps } from '@/lib/strapi/makeProps/makeBannerLink';
import { makeBaseProductWithoutLogoProps } from './makeProducts';
import { compact } from 'lodash';
import { StrapiUseCaseListPages } from '@/lib/strapi/types/useCaseListPage';
import { UseCase } from '@/lib/types/useCaseData';
import { UseCasesPageProps } from '@/app/[productSlug]/use-cases/page';

export function makeUseCaseListPagesProps(
  strapiUseCaseList: StrapiUseCaseListPages
): readonly UseCasesPageProps[] {
  return compact(
    strapiUseCaseList.data.map((attributes) => {
      const slug = attributes.product?.slug;
      if (!slug) {
        // eslint-disable-next-line functional/no-expression-statements
        console.error(
          `Error while processing UseCaseListPage ${attributes.title}: missing product slug. Skipping...`
        );
        return null;
      }

      const useCases: readonly UseCase[] = compact(
        attributes.useCases.map((useCaseAttributes) => {
          const slug = useCaseAttributes.product?.slug;
          if (!slug) {
            console.error(
              `Error while processing UseCase with title "${useCaseAttributes.title}": missing product slug. Skipping...`
            );
            return null;
          }

          if (!useCaseAttributes.slug || !useCaseAttributes.title) {
            console.error(
              `Error while processing UseCase: missing title or slug. Title: ${useCaseAttributes.title} | Slug: ${useCaseAttributes.slug}. Skipping...`
            );
            return null;
          }

          // eslint-disable-next-line functional/no-try-statements
          try {
            return {
              name: useCaseAttributes.title,
              path: `/${slug}/use-cases/${useCaseAttributes.slug}`,
              title: useCaseAttributes.title,
              publishedAt: useCaseAttributes.publishedAt
                ? new Date(useCaseAttributes.publishedAt)
                : undefined,
              showInOverview: false,
              coverImage: useCaseAttributes.coverImage,
              tags: useCaseAttributes.tags?.map((tag) => tag) || [],
            } satisfies UseCase;
          } catch (error) {
            // eslint-disable-next-line functional/no-expression-statements
            console.error(
              `Error while processing UseCase with title ${useCaseAttributes.title}:`,
              error,
              'Skipping...'
            );
            return null;
          }
        })
      );

      return {
        name: attributes.title,
        path: `/${attributes.product.slug}/use-cases`,
        product: makeBaseProductWithoutLogoProps(attributes.product),
        abstract: {
          title: attributes.title,
          description: attributes.description,
        },
        seo: attributes.seo,
        useCases: useCases,
        bannerLinks:
          attributes.bannerLinks.length > 0
            ? attributes.bannerLinks.map((bannerLink) =>
                makeBannerLinkProps(bannerLink)
              )
            : attributes.product.bannerLinks?.map((bannerLink) =>
                makeBannerLinkProps(bannerLink)
              ),
        enableFilters: attributes.enableFilters,
      };
    })
  );
}
